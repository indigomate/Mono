import "./message-experience.css";
import { useReplySequence } from "./useReplySequence";
import { FamilyConfirmDialog } from "../components/ui/FamilyConfirmDialog";
import { LoadingExperience } from "../components/ui/LoadingExperience";
import { InlineDisclosureMenu } from "../components/ui/InlineDisclosureMenu";
import AnimatedContent from "../components/react-bits/AnimatedContent/AnimatedContent";
import {
  ArrowUpRight,
  ArrowUp,
  Plus,
  Trash01,
  Compass01,
  Edit03,
  FileCheck02,
  Car01,
  Building02,
  Inbox01,
  Eye,
  Bookmark,
} from "@untitledui/icons";
import { FieldInput } from "../components/ui/FieldInput";
import { useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { type ChatTool, type Turn, toolTitles } from "./model";
export function ChatSurface({
  role,
  turns,
  onSend,
  onReset,
  onDelete,
  renderTool,
  onReopen,
  context,
}: {
  context?: ReactNode;
  role: "customer" | "provider";
  turns: Turn[];
  onSend: (text: string) => void;
  onReset: () => void;
  onDelete: (id: string) => void;
  renderTool: (tool: ChatTool) => ReactNode;
  onReopen: (tool: ChatTool) => void;
}) {
  const sequence = useReplySequence(turns);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [notice, setNotice] = useState("");
  const pendingRef = useRef<HTMLDivElement>(null);
  const restored = useRef(turns.length > 1);
  const displayed = turns.filter((turn) => sequence.visible.has(turn.id));
  const [input, setInput] = useState("");
  const [welcomeOpen, setWelcomeOpen] = useState(turns.length === 1);
  const last = useRef<HTMLElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [resetConfirm, setResetConfirm] = useState(false);
  const [contextOpen, setContextOpen] = useState(false);
  const contextToggle = useRef<HTMLButtonElement>(null);
  const contextLabel =
    role === "customer" ? "Trip details" : "Business details";
  const contextId = `${role}-context-panel`;
  const followRequested = useRef(false);
  const nearBottom = useRef(true);
  const initialized = useRef(false);
  const previousUser = useRef<string | undefined>(undefined);
  const [showLatest, setShowLatest] = useState(false);
  const latestId = turns.at(-1)?.id;
  const pendingTool = turns.at(-1)?.tool?.kind;
  const pendingLabel =
    pendingTool === "vehicles" || pendingTool === "vehicle"
      ? "Preparing vehicle options"
      : pendingTool === "trip" ||
          pendingTool === "services" ||
          pendingTool === "enquiry"
        ? "Shaping your journey"
        : pendingTool === "listing" ||
            pendingTool === "profile" ||
            pendingTool === "fleet" ||
            pendingTool === "storefront" ||
            pendingTool === "plans" ||
            pendingTool === "summary"
          ? "Preparing your workspace"
          : pendingTool === "requests" || pendingTool === "inbox"
            ? "Opening your records"
            : "Preparing your reply";
  const latestUserId = turns.filter((turn) => turn.role === "user").at(-1)?.id;
  function updateReadingPosition() {
    const scroll = scrollRef.current;
    if (!scroll) return;
    nearBottom.current =
      scroll.scrollHeight - scroll.scrollTop - scroll.clientHeight < 96;
    setShowLatest(
      turns.length > 1 &&
        Boolean(last.current) &&
        last.current!.getBoundingClientRect().top >
          scroll.getBoundingClientRect().bottom - 20,
    );
  }
  function requestFollow() {
    followRequested.current = true;
    requestAnimationFrame(() => {
      followRequested.current = false;
    });
  }
  function send(text: string) {
    setContextOpen(false);
    if (
      /^(?:clear(?: my| this| the)? (?:chat|conversation)(?: history)?|new chat|start (?:a )?new chat)[.!?]?$/i.test(
        text.trim(),
      )
    ) {
      setResetConfirm(true);
      return;
    }
    setNotice("");
    setWelcomeOpen(false);
    requestFollow();
    onSend(text);
  }
  useLayoutEffect(() => {
    const scroll = scrollRef.current;
    const message = sequence.pending
      ? pendingRef.current || last.current
      : last.current;
    if (!scroll || !message) return;
    const shouldFollow =
      !initialized.current ||
      followRequested.current ||
      nearBottom.current ||
      latestUserId !== previousUser.current;
    initialized.current = true;
    previousUser.current = latestUserId;
    if (turns.length === 1) scroll.scrollTop = 0;
    else if (shouldFollow) {
      const top =
        scroll.scrollTop +
        message.getBoundingClientRect().top -
        scroll.getBoundingClientRect().top -
        16;
      // Scroll only this container; scrollIntoView can move Safari's outer page.
      scroll.scrollTo({ top: Math.max(0, top), behavior: "instant" });
    }
    followRequested.current = false;
    updateReadingPosition();
  }, [latestId, latestUserId, sequence.frame, sequence.pending]);
  const shortcuts =
    role === "customer"
      ? ["Explore services", "Edit my trip", "My requests"]
      : ["Add a listing", "My fleet", "Incoming requests"];
  return (
    <section
      className="chat-surface"
      onClickCapture={(e) => {
        if (
          (e.target as HTMLElement).closest(
            ".chat-tool button, .past-tool button",
          )
        )
          requestFollow();
      }}
      onSubmitCapture={requestFollow}
      aria-label={
        role === "customer" ? "Customer conversation" : "Provider conversation"
      }
    >
      <div className="chat-context-controls">
        {context && (
          <button
            type="button"
            ref={contextToggle}
            className="context-toggle"
            aria-expanded={contextOpen}
            aria-controls={contextId}
            onClick={() => setContextOpen((open) => !open)}
          >
            {contextLabel}
            <span aria-hidden="true">{contextOpen ? "−" : "+"}</span>
          </button>
        )}
        <InlineDisclosureMenu
          items={[
            {
              id: "start-here",
              label: "Start here",
              icon: <ArrowUp width={18} height={18} />,
            },
            {
              id: "new-chat",
              label: "Clear chat",
              icon: <Trash01 width={18} height={18} />,
            },
            ...(role === "customer"
              ? [
                  {
                    id: "Explore services",
                    label: "Explore services",
                    icon: <Compass01 width={18} height={18} />,
                  },
                  {
                    id: "Edit my trip",
                    label: "Edit my trip",
                    icon: <Edit03 width={18} height={18} />,
                  },
                  {
                    id: "Saved cars",
                    label: "Saved cars",
                    icon: <Bookmark width={18} height={18} />,
                  },
                  {
                    id: "My requests",
                    label: "My requests",
                    icon: <FileCheck02 width={18} height={18} />,
                  },
                ]
              : [
                  {
                    id: "Add a listing",
                    label: "Add a listing",
                    icon: <Plus width={18} height={18} />,
                  },
                  {
                    id: "My fleet",
                    label: "My fleet",
                    icon: <Car01 width={18} height={18} />,
                  },
                  {
                    id: "summary",
                    label: "Business overview",
                    icon: <Building02 width={18} height={18} />,
                  },
                  {
                    id: "Business profile",
                    label: "Business profile",
                    icon: <Building02 width={18} height={18} />,
                  },
                  {
                    id: "Incoming requests",
                    label: "Incoming requests",
                    icon: <Inbox01 width={18} height={18} />,
                  },
                  {
                    id: "Provider plans",
                    label: "Provider plans",
                    icon: <Building02 width={18} height={18} />,
                  },
                  {
                    id: "Storefront preview",
                    label: "Storefront preview",
                    icon: <Eye width={18} height={18} />,
                  },
                ]),
          ]}
          onAction={(key) => {
            setContextOpen(false);
            if (key === "new-chat") setResetConfirm(true);
            else if (key === "start-here") {
              setWelcomeOpen(true);
              scrollRef.current?.scrollTo({ top: 0, behavior: "instant" });
            } else send(key);
          }}
        />
      </div>
      {contextOpen && (
        <section
          id={contextId}
          className="chat-context-panel"
          aria-label={`${contextLabel} panel`}
          onKeyDown={(e) => {
            if (e.key === "Escape") {
              e.preventDefault();
              setContextOpen(false);
              contextToggle.current?.focus({ preventScroll: true });
            }
          }}
          onClick={(e) => {
            if ((e.target as HTMLElement).closest("[data-context-action]")) {
              setContextOpen(false);
              contextToggle.current?.focus({ preventScroll: true });
            }
          }}
        >
          <AnimatedContent
            className="context-reveal"
            trigger="mount"
            distance={8}
            duration={0.18}
            initialOpacity={1}
            delay={0}
          >
            {context}
          </AnimatedContent>
        </section>
      )}
      <div
        className="chat-scroll"
        ref={scrollRef}
        onScroll={updateReadingPosition}
        onClick={() => {
          if (contextOpen) setContextOpen(false);
        }}
      >
        <div className="chat-thread">
          {welcomeOpen && (
            <div className="chat-introduction">
              <h2>
                {role === "customer"
                  ? "Where are you going?"
                  : "Let’s build your business."}
              </h2>
              <div className="welcome-paths" aria-label="Start a conversation">
                {(role === "customer"
                  ? [
                      ["Drive myself", "Find a self-drive vehicle"],
                      ["Book a chauffeur", "I need Chauffeur service"],
                    ]
                  : [
                      ["List my vehicle", "Add a listing"],
                      ["Offer a service", "Business profile"],
                    ]
                ).map(([label, command]) => (
                  <button
                    key={label}
                    aria-label={label}
                    onClick={() => send(command)}
                  >
                    <b>{label}</b>
                    <ArrowUpRight width={16} height={16} aria-hidden="true" />
                  </button>
                ))}
              </div>
            </div>
          )}
          <div
            className="chat-transcript"
            role="log"
            aria-label="Conversation messages"
          >
            {restored.current && displayed.length > 0 && (
              <p className="chat-history-note">
                Previous conversation · Saved on this device
              </p>
            )}
            {displayed.map((message) => (
              <article
                key={message.id}
                ref={message.id === displayed.at(-1)?.id ? last : undefined}
                className={`conversation-turn turn-${message.role}${sequence.fresh.has(message.id) ? " turn-reveal" : ""}`}
                data-message-id={message.id}
              >
                <div className="turn-marker" aria-hidden="true">
                  {message.role === "assistant" ? "✧" : "You"}
                </div>
                <div className="turn-body">
                  <span className="turn-role">
                    {message.role === "assistant"
                      ? "GOMONO"
                      : role === "customer"
                        ? "YOU"
                        : "YOU / PROVIDER"}
                  </span>
                  <button
                    className="message-delete"
                    type="button"
                    aria-label={`Delete ${message.role === "user" ? "your" : "GOMONO"} message`}
                    title="Delete this message"
                    onClick={() => setDeleteId(message.id)}
                  >
                    <Trash01 width={15} height={15} aria-hidden="true" />
                  </button>
                  <p className="turn-text">{message.text}</p>
                  {message.tool &&
                    sequence.tools.has(message.id) &&
                    (message.id === turns.at(-1)?.id &&
                    !message.toolArchived ? (
                      <section
                        className={`chat-tool${sequence.fresh.has(message.id) ? " tool-reveal" : ""}`}
                        aria-label={toolTitles[message.tool.kind]}
                        key={message.id}
                      >
                        {renderTool(message.tool)}
                      </section>
                    ) : (
                      <div className="past-tool">
                        <span>
                          {toolTitles[message.tool.kind]} · earlier step
                        </span>
                        <button
                          className="text-button"
                          onClick={() => {
                            setContextOpen(false);
                            requestFollow();
                            onReopen(message.tool!);
                          }}
                        >
                          Reopen in chat →
                        </button>
                      </div>
                    ))}
                </div>
              </article>
            ))}
            {sequence.pending && (
              <div
                ref={pendingRef}
                className="chat-reply-pending"
                role="status"
                aria-label="Preparing reply"
              >
                <LoadingExperience
                  variant="reply"
                  label={pendingLabel}
                  announce={false}
                />
                <span className="sr-only">Demo response presentation</span>
              </div>
            )}
            {turns.length === 0 && (
              <p className="chat-history-note">
                No messages. Start a new conversation below. Your saved records
                are still available.
              </p>
            )}
          </div>
        </div>
      </div>
      {showLatest && (
        <div className="chat-reading-controls">
          <button
            type="button"
            onClick={() => {
              const scroll = scrollRef.current;
              if (scroll)
                scroll.scrollTo({
                  top: scroll.scrollHeight,
                  behavior: "instant",
                });
              updateReadingPosition();
              inputRef.current?.focus({ preventScroll: true });
            }}
          >
            Back to latest ↓
          </button>
        </div>
      )}
      <div className="composer-dock">
        <div className="composer-inner">
          <div className="chat-suggestion-box">
            <div
              className="chat-shortcuts"
              aria-label="Conversation suggestions"
            >
              {shortcuts.map((s) => (
                <button
                  key={s}
                  type="button"
                  disabled={sequence.pending}
                  onClick={() => send(s)}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
          <FamilyConfirmDialog
            isOpen={Boolean(deleteId)}
            onOpenChange={(open) => {
              if (!open) setDeleteId(null);
            }}
            title="Delete this message?"
            description={`“${turns.find((message) => message.id === deleteId)?.text.slice(0, 100) || "This message"}” — Only this message and its attached card will be removed. Saved requests, listings, preferences and unfinished drafts stay on this device.`}
            confirmLabel="Delete message"
            cancelLabel="Keep message"
            icon={<Trash01 width={22} height={22} />}
            onConfirm={() => {
              if (turns.length === 1) restored.current = false;
              if (deleteId) onDelete(deleteId);
              setDeleteId(null);
              setNotice("Message deleted. Saved records kept.");
              requestAnimationFrame(() =>
                inputRef.current?.focus({ preventScroll: true }),
              );
            }}
          />
          <FamilyConfirmDialog
            isOpen={resetConfirm}
            onOpenChange={setResetConfirm}
            title="Clear this chat?"
            description={
              role === "customer"
                ? "Only this customer conversation will be cleared. Saved requests, service enquiries, saved cars and trip preferences stay on this device."
                : "Only this provider conversation will be cleared. Your saved profile, listings, preview selections and unfinished drafts stay on this device."
            }
            confirmLabel="Clear chat"
            cancelLabel="Keep chatting"
            onConfirm={() => {
              setInput("");
              setContextOpen(false);
              restored.current = false;
              setWelcomeOpen(true);
              onReset();
              inputRef.current?.focus({ preventScroll: true });
            }}
          />
          <form
            className="chat-composer"
            onSubmit={(e) => {
              e.preventDefault();
              if (input.trim() && !sequence.pending) {
                send(input.trim());
                setInput("");
              }
            }}
          >
            <span aria-hidden="true">✧</span>
            <FieldInput
              ref={inputRef}
              aria-label="Message GOMONO"
              maxLength={1000}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={
                role === "customer"
                  ? "“I need an automatic SUV for 3 days…”"
                  : "“Add my BMW for self-drive and chauffeur trips…”"
              }
            />
            <button
              aria-label="Send message"
              disabled={!input.trim() || sequence.pending}
            >
              ↑
            </button>
          </form>
          <span className="sr-only" role="status">
            {notice}
          </span>
          <p className="chat-footnote">
            Guided demo · Saved on this device · No live availability, payments
            or provider delivery
          </p>
        </div>
      </div>
    </section>
  );
}
