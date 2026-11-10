import { JourneyContext, DecisionHelp } from "./JourneyContext";
import { RequestRecord } from "./RequestRecord";
import { useEffect, useRef, useState } from "react";
import {
  loadJourney,
  loadRequests,
  saveDemo,
  interpret,
  matches,
  reply,
  inventory,
  money,
  today,
  type Trip,
} from "../demo/marketplace";
import {
  services,
  loadInquiries,
  serviceLabel,
  isService,
  type ServiceType,
} from "../demo/services";
import { type CustomerView, type Navigate } from "../workspace/navigation";
import { TripEditor } from "../workspace/TripEditor";
import { VehicleReview } from "../workspace/VehicleReview";
import {
  ServiceEnquiry,
  ServiceInquiryList,
  loadFields,
  type EnquiryFields,
} from "../workspace/ServiceEnquiry";
import { ChatSurface } from "./ChatSurface";
import { VehicleCards } from "./VehicleCards";
import { loadTurns, turn, detectService, type ChatTool } from "./model";
type EnquiryService = Exclude<ServiceType, "self-drive">;
function routeTool(view: CustomerView): ChatTool | undefined {
  return view === "bookings"
    ? { kind: "requests" }
    : isService(view)
      ? { kind: "enquiry", service: view }
      : undefined;
}
function nextField(
  f: EnquiryFields,
  service: EnquiryService,
): keyof EnquiryFields | null {
  if (!f.pickup.trim()) return "pickup";
  if (["airport", "group"].includes(service) && !f.destination.trim())
    return "destination";
  if (!f.date) return "date";
  if (service === "long-term" && !f.end) return "end";
  if (service !== "long-term" && !f.time) return "time";
  if (!f.email) return "email";
  return null;
}
function serviceQuestion(f: EnquiryFields, service: EnquiryService) {
  const key = nextField(f, service);
  return (
    (
      {
        pickup: "Where should the pickup be?",
        destination: "Where are you going?",
        date: "What date do you need? You can type YYYY-MM-DD.",
        end: "When should the rental end? Use YYYY-MM-DD.",
        time: "What pickup time works for you? Use HH:MM, in Cape Town time.",
        email: "What email should be saved with this demo brief?",
      } as Partial<Record<keyof EnquiryFields, string>>
    )[key!] ||
    "Your brief is ready to review below. Check the details, acknowledge demo status, then save it here. No provider is contacted."
  );
}
function collect(
  text: string,
  previous: EnquiryFields,
  service: EnquiryService,
  answerMissing: boolean,
): EnquiryFields {
  const f = { ...previous };
  let extracted = false;
  const email = text.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i);
  if (email) {
    f.email = email[0];
    extracted = true;
  }
  const dates = text.match(/\b\d{4}-\d{2}-\d{2}\b/g);
  if (dates?.length) {
    if (nextField(previous, service) === "end") f.end = dates[0];
    else {
      f.date = dates[0];
      if (dates[1]) f.end = dates[1];
    }
    extracted = true;
  }
  if (/\btomorrow\b/i.test(text)) {
    const d = new Date(`${today()}T12:00:00`);
    d.setDate(d.getDate() + 1);
    f.date = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
    extracted = true;
  }
  const time = text.match(/\b([01]?\d|2[0-3]):([0-5]\d)\b/);
  if (time) {
    f.time = `${time[1].padStart(2, "0")}:${time[2]}`;
    extracted = true;
  }
  const route = text.match(
    /\bfrom\s+(.+?)\s+to\s+(.+?)(?=\s+(?:on|at|for)\b|$)/i,
  );
  if (route) {
    f.pickup = route[1].trim();
    f.destination = route[2].trim();
    extracted = true;
  }
  const people = text.match(/\b(\d+)\s*(?:people|passengers|seats)\b/i);
  if (people) {
    f.passengers = Math.min(100, Number(people[1]));
    extracted = true;
  }
  const hours = text.match(/\b(\d+)\s*hours?\b/i);
  if (hours) {
    f.hours = Math.min(168, Number(hours[1]));
    extracted = true;
  }
  const budget = text.match(/\b(?:R|ZAR)\s*(\d+(?:[ ,]\d{3})*)/i);
  if (budget) {
    f.budget = Number(budget[1].replace(/[ ,]/g, ""));
    extracted = true;
  }
  if (!["chauffeur", "airport"].includes(service)) {
    if (/without a driver|self[ -]?drive/i.test(text)) {
      f.driver = "self-drive";
      extracted = true;
    } else if (/with a driver/i.test(text)) {
      f.driver = "with-driver";
      extracted = true;
    }
  }
  if (answerMissing && !extracted) {
    const field = nextField(previous, service);
    if ((field === "pickup" || field === "destination") && text.length <= 200)
      f[field] = text.trim();
    else if (!field)
      f.notes = [f.notes, text].filter(Boolean).join("\n").slice(0, 2000);
  }
  return f;
}
export function CustomerConversation({
  view,
  navigate,
}: {
  view: CustomerView;
  navigate: Navigate;
}) {
  const [turns, setTurns] = useState(() => {
    const initial = loadTurns("customer");
    const tool = routeTool(view);
    return tool && initial.at(-1)?.tool?.kind !== tool.kind
      ? [
          ...initial,
          turn(
            "assistant",
            tool.kind === "requests"
              ? "Here are your locally saved requests."
              : "Let’s prepare this service brief together.",
            tool,
          ),
        ]
      : initial;
  });
  const [trip, setTrip] = useState(() => loadJourney().trip);
  const [requests, setRequests] = useState(loadRequests);
  const [inquiries, setInquiries] = useState(loadInquiries);
  const initialService = turns.at(-1)?.tool?.service || "chauffeur";
  const [serviceState, setServiceState] = useState<{
    service: EnquiryService;
    fields: EnquiryFields;
  }>(() => ({ service: initialService, fields: loadFields(initialService) }));
  const previousView = useRef(view);
  const active = turns.at(-1)?.tool;
  useEffect(() => saveDemo("mono-customer-chat-v1", turns), [turns]);
  useEffect(
    () =>
      saveDemo("mono-journey-v1", {
        trip,
        searched: turns.some((t) => t.tool?.kind === "vehicles"),
        messages: turns.map((t) => ({ role: t.role, text: t.text })),
      }),
    [trip, turns],
  );
  useEffect(() => saveDemo("mono-requests", requests), [requests]);
  useEffect(
    () => saveDemo("mono-service-inquiries-v1", inquiries),
    [inquiries],
  );
  useEffect(() => {
    if (previousView.current === view) return;
    previousView.current = view;
    const tool = routeTool(view);
    if (tool) {
      if (tool.service)
        setServiceState({
          service: tool.service,
          fields: loadFields(tool.service),
        });
      setTurns((all) =>
        [
          ...all,
          turn("assistant", "We can handle that right here.", tool),
        ].slice(-60),
      );
    }
  }, [view]);
  function respond(user: string, text: string, tool?: ChatTool) {
    setTurns((all) =>
      [
        ...all,
        ...(user ? [turn("user", user)] : []),
        turn("assistant", text, tool),
      ].slice(-60),
    );
  }
  function openEnquiry(service: EnquiryService, text: string) {
    const f = collect(text, loadFields(service), service, false);
    setServiceState({ service, fields: f });
    respond(
      text,
      `Let’s plan your ${serviceLabel(service).toLowerCase()}. ${serviceQuestion(f, service)}`,
      { kind: "enquiry", service },
    );
  }
  function send(text: string) {
    if (/\b(provider|add a listing|my fleet|business profile)\b/i.test(text)) {
      respond(
        text,
        "You’re in the customer conversation. Use Change workspace to enter your separate provider assistant; your customer progress stays here.",
      );
      return;
    }
    if (
      /my requests|request history|your requests|saved requests|view requests|my bookings/i.test(
        text,
      )
    ) {
      respond(
        text,
        "Here are your saved rental requests and service enquiries. They have not been sent to providers.",
        { kind: "requests" },
      );
      return;
    }
    if (
      /explore services|all services|service choices|what.*offer|help|what can/i.test(
        text,
      )
    ) {
      respond(
        text,
        "Choose a starting point, or describe the trip in your own words. Every option continues in this conversation.",
        { kind: "services" },
      );
      return;
    }
    if (/edit.*trip|trip details|trip preferences|change.*dates/i.test(text)) {
      respond(
        text,
        "Here’s your saved trip brief. Change any detail below or tell me the preference you want to change.",
        { kind: "trip" },
      );
      return;
    }
    if (/new trip|reset trip|start over/i.test(text)) {
      setTrip({
        ...loadJourney().trip,
        category: "",
        make: "",
        tier: "",
        transmission: "",
        start: "",
        end: "",
        days: 0,
        budget: 0,
        passengers: 0,
      });
      respond(
        text,
        "A fresh trip brief is ready. What kind of rental or transport do you need?",
        { kind: "services" },
      );
      return;
    }
    const car = inventory.find(
      (c) =>
        text.toLowerCase().includes(c.name.toLowerCase()) ||
        (/vehicle review/i.test(text) &&
          c.id ===
            turns.filter((t) => t.tool?.kind === "vehicle").at(-1)?.tool
              ?.vehicleId),
    );
    if (car && /view|show|review|book|request|choose|select|open/i.test(text)) {
      respond(
        text,
        `Let’s review the ${car.name}. Details, dates and the base rental estimate stay here; saving requires your explicit acknowledgement.`,
        { kind: "vehicle", vehicleId: car.id },
      );
      return;
    }
    const service = detectService(text);
    const wantsSwitch =
      active?.kind !== "enquiry" ||
      /\b(switch|instead|change.*service)\b|^(?:i need|i want|book|find|prepare|choose)\b/i.test(
        text,
      );
    if (
      service &&
      service !== "self-drive" &&
      wantsSwitch &&
      (active?.kind !== "enquiry" || active.service !== service)
    ) {
      openEnquiry(service, text);
      return;
    }
    if (
      active?.kind === "enquiry" &&
      active.service &&
      !(service === "self-drive" && wantsSwitch)
    ) {
      const previous =
        serviceState.service === active.service
          ? serviceState.fields
          : loadFields(active.service);
      const fields = collect(text, previous, active.service, true);
      setServiceState({ service: active.service, fields });
      respond(text, serviceQuestion(fields, active.service), {
        kind: "enquiry",
        service: active.service,
      });
      return;
    }
    const next = interpret(text, trip);
    const changed = JSON.stringify(next) !== JSON.stringify(trip);
    if (
      service === "self-drive" ||
      changed ||
      /vehicle matches|self.drive|show.*cars|car|suv|sedan|vehicle|motorcycle|bakkie|truck|van|camper/i.test(
        text,
      )
    ) {
      setTrip(next);
      const found = matches(next);
      respond(text, reply(next, found.length), {
        kind: "vehicles",
        ids: found.map((c) => c.id),
      });
      return;
    }
    respond(
      text,
      "I can help you find a self-drive vehicle, prepare a chauffeur or transport brief, edit your trip, or review your requests. Which would you like to do?",
      { kind: "services" },
    );
  }
  const toolNavigate: Navigate = (next) => {
    if (next === "bookings") send("My requests");
    else if (next === "customer") send("Explore services");
    else navigate(next);
  };
  function renderTool(tool: ChatTool) {
    switch (tool.kind) {
      case "services":
        return (
          <div className="chat-service-options">
            {services.map((s) => (
              <button
                key={s.id}
                onClick={() =>
                  send(
                    s.id === "self-drive"
                      ? "Find a self-drive vehicle"
                      : `I need ${s.label}`,
                  )
                }
              >
                <b>{s.label}</b>
                <span>{s.description}</span>
              </button>
            ))}
          </div>
        );
      case "trip":
        return (
          <TripEditor
            trip={trip}
            onCancel={() =>
              respond(
                "",
                "We can keep planning here. What would you like to change next?",
              )
            }
            onSave={(next) => {
              setTrip(next);
              respond(
                "Update my trip",
                "Your trip brief is updated. Here are the matching samples.",
                { kind: "vehicles", ids: matches(next).map((c) => c.id) },
              );
            }}
          />
        );
      case "vehicles":
        return (
          <>
            <VehicleCards
              ids={tool.ids || []}
              trip={trip}
              onSelect={(id) =>
                send(`Show me ${inventory.find((c) => c.id === id)!.name}`)
              }
            />
            <div className="inline-actions">
              <button onClick={() => send("Edit my trip")}>
                Edit trip details
              </button>
              <button onClick={() => send("I need a custom request")}>
                Prepare a custom enquiry
              </button>
            </div>
          </>
        );
      case "vehicle": {
        const car = inventory.find((c) => c.id === tool.vehicleId);
        return car ? (
          <VehicleReview
            key={tool.vehicleId}
            inline
            initialStep={tool.stage}
            onTripChange={setTrip}
            onStepChange={(stage) =>
              setTurns((all) =>
                all.map((t, i) =>
                  i === all.length - 1 ? { ...t, tool: { ...tool, stage } } : t,
                ),
              )
            }
            car={car}
            trip={trip}
            onClose={() =>
              respond("", "Here are your vehicle matches again.", {
                kind: "vehicles",
                ids: matches(trip).map((c) => c.id),
              })
            }
            onSave={(r, next) => {
              setRequests((all) => [r, ...all]);
              setTrip(next);
              respond(
                "Save my demo rental request",
                `Your ${r.car} request is saved locally: ${r.start} to ${r.end}, ${money(r.total)} estimated base rental. No provider has been contacted.`,
                { kind: "requests" },
              );
            }}
          />
        ) : (
          <p>That sample is no longer in the inventory. Ask for new matches.</p>
        );
      }
      case "enquiry": {
        const service = tool.service || "custom";
        const fields =
          serviceState.service === service
            ? serviceState.fields
            : loadFields(service);
        return (
          <ServiceEnquiry
            key={service}
            service={service}
            controlledFields={fields}
            onFieldsChange={(fields) => setServiceState({ service, fields })}
            navigate={toolNavigate}
            onSave={(enquiry) => {
              setInquiries((all) => [enquiry, ...all]);
              respond(
                "Save my demo service enquiry",
                `Your ${serviceLabel(service).toLowerCase()} enquiry is saved on this device. It is not sent or confirmed.`,
                { kind: "requests" },
              );
            }}
          />
        );
      }
      case "requests":
        return (
          <div className="inline-requests">
            {!requests.length && !inquiries.length ? (
              <p>
                No requests saved yet. Tell me what you need and we’ll prepare
                one together.
              </p>
            ) : (
              <>
                {requests.map((r) => (
                  <RequestRecord
                    key={r.id}
                    request={r}
                    onContinue={() => send(`Show me ${r.car}`)}
                  />
                ))}
                <ServiceInquiryList
                  inquiries={inquiries}
                  onReview={(inquiry) => {
                    const {
                      id: _id,
                      createdAt: _createdAt,
                      service,
                      ...fields
                    } = inquiry;
                    setServiceState({ service, fields });
                    respond(
                      "Revise my saved service brief",
                      "Here’s a copy of your saved brief to revise. Your original stays in request history; review before saving a new version.",
                      { kind: "enquiry", service },
                    );
                  }}
                />
                <DecisionHelp />
              </>
            )}
          </div>
        );
      default:
        return <p>Tell me what you’d like to do next.</p>;
    }
  }
  const contextTool = [...turns]
    .reverse()
    .find((t) =>
      ["enquiry", "vehicles", "vehicle", "trip", "services"].includes(
        t.tool?.kind || "",
      ),
    )?.tool;
  return (
    <ChatSurface
      role="customer"
      context={
        <JourneyContext
          service={
            contextTool && contextTool.kind !== "services"
              ? contextTool.service || "self-drive"
              : null
          }
          trip={trip}
          fields={
            contextTool?.kind === "enquiry" ? serviceState.fields : undefined
          }
          stage={
            contextTool?.kind === "vehicle"
              ? "review"
              : contextTool?.kind === "vehicles"
                ? "options"
                : "brief"
          }
          onEdit={() => {
            if (contextTool?.kind === "enquiry")
              respond(
                "Edit my service brief",
                "Review or change your service details here.",
                contextTool,
              );
            else send("Edit my trip");
          }}
        />
      }
      onReopen={(tool) => {
        if (tool.service)
          setServiceState({
            service: tool.service,
            fields: loadFields(tool.service),
          });
        respond(
          "Reopen this step",
          "Here is the current version of that tool, in this conversation.",
          tool,
        );
      }}
      turns={turns}
      onSend={send}
      renderTool={renderTool}
      onReset={() =>
        setTurns([
          turn(
            "assistant",
            "A fresh conversation, with your saved trip and requests still available. Where would you like to go?",
          ),
        ])
      }
    />
  );
}
