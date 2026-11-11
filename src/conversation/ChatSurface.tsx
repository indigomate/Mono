import { FamilyConfirmDialog } from "../components/ui/FamilyConfirmDialog";
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
  renderTool,
  onReopen,
  context,
}: {
  context?: ReactNode;
  role: "customer" | "provider";
  turns: Turn[];
  onSend: (text: string) => void;
  onReset: () => void;
  renderTool: (tool: ChatTool) => ReactNode;
  onReopen: (tool: ChatTool) => void;
}) {
  const [input, setInput] = useState("");
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
    requestFollow();
    onSend(text);
  }
  useLayoutEffect(() => {
    const scroll = scrollRef.current;
    const message = last.current;
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
  }, [latestId, latestUserId]);
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
            else if (key === "start-here")
              scrollRef.current?.scrollTo({ top: 0, behavior: "instant" });
            else send(key);
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
          <div className="chat-introduction">
            <span className="eyebrow">
              {role === "customer"
                ? "RENT & RIDE / YOUR CONCIERGE"
                : "PROVIDER STUDIO / YOUR ASSISTANT"}
            </span>
            <h2>
              {role === "customer"
                ? "Every journey starts\nwith a conversation."
                : "Your business,\none conversation away."}
            </h2>
            <p>
              {role === "customer"
                ? "From private rentals to chauffeur trips. Tell us the plan."
                : "Private owner, fleet or chauffeur operator. Let’s build it together."}
            </p>
            <div className="welcome-paths" aria-label="Start a conversation">
              {(role === "customer"
                ? [
                    [
                      "Drive myself",
                      "Find a self-drive vehicle",
                      "Your keys. Your own route.",
                    ],
                    [
                      "Book a chauffeur",
                      "I need Chauffeur service",
                      "A driver for your schedule.",
                    ],
                    [
                      "Move a group",
                      "I need Group transport",
                      "More people. One plan.",
                    ],
                    [
                      "Plan dates & budget",
                      "Edit my trip",
                      "Open calendars and refine your brief.",
                    ],
                    [
                      "Track my requests",
                      "My requests",
                      "Review the requests saved on this device.",
                    ],
                    [
                      "Explore every service",
                      "Explore services",
                      "Airports, events, tours & more.",
                    ],
                  ]
                : [
                    [
                      "List my vehicle",
                      "Add a listing",
                      "Build a listing together.",
                    ],
                    [
                      "Offer a service",
                      "Business profile",
                      "Set up your transport business.",
                    ],
                    [
                      "Business overview",
                      "summary",
                      "See your listings and next steps.",
                    ],
                    [
                      "Manage requests",
                      "Incoming requests",
                      "Keep customer requests in view.",
                    ],
                  ]
              ).map(([label, command, caption]) => (
                <button
                  key={label}
                  aria-label={label}
                  onClick={() => send(command)}
                >
                  <span aria-hidden="true">
                    <ArrowUpRight width={16} height={16} />
                  </span>
                  <b>{label}</b>
                  <small>{caption}</small>
                </button>
              ))}
            </div>
          </div>
          <div
            className="chat-transcript"
            role="log"
            aria-label="Conversation messages"
          >
            {turns.map((message, index) => (
              <article
                key={message.id}
                ref={index === turns.length - 1 ? last : undefined}
                className={`conversation-turn turn-${message.role}`}
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
                  <p className="turn-text">{message.text}</p>
                  {message.tool &&
                    (index === turns.length - 1 ? (
                      <section
                        className="chat-tool"
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
                <button key={s} type="button" onClick={() => send(s)}>
                  {s}
                </button>
              ))}
            </div>
          </div>
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
              onReset();
              inputRef.current?.focus({ preventScroll: true });
            }}
          />
          <form
            className="chat-composer"
            onSubmit={(e) => {
              e.preventDefault();
              if (input.trim()) {
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
            <button aria-label="Send message" disabled={!input.trim()}>
              ↑
            </button>
          </form>
          <p className="chat-footnote">
            Guided demo · Saved on this device · No live availability, payments
            or provider delivery
          </p>
        </div>
      </div>
    </section>
  );
}
