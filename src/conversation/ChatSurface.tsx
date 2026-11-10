import {
  Modal,
  ModalOverlay,
  Dialog,
  Heading,
  Button,
} from "react-aria-components";
import { FieldInput } from "../components/ui/FieldInput";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { type ChatTool, type Turn, toolTitles } from "./model";
export function ChatSurface({
  role,
  turns,
  onSend,
  onReset,
  renderTool,
  onReopen,
}: {
  role: "customer" | "provider";
  turns: Turn[];
  onSend: (text: string) => void;
  onReset: () => void;
  renderTool: (tool: ChatTool) => ReactNode;
  onReopen: (tool: ChatTool) => void;
}) {
  const [input, setInput] = useState("");
  const last = useRef<HTMLElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [resetConfirm, setResetConfirm] = useState(false);
  useEffect(() => {
    last.current?.scrollIntoView({ block: "start", behavior: "instant" });
  }, [turns.at(-1)?.id]);
  const shortcuts =
    role === "customer"
      ? ["Explore services", "Edit my trip", "My requests"]
      : [
          "Add a listing",
          "My fleet",
          "Business profile",
          "Incoming requests",
          "Storefront preview",
        ];
  return (
    <section
      className="chat-surface"
      aria-label={
        role === "customer" ? "Customer conversation" : "Provider conversation"
      }
    >
      <div className="chat-scroll">
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
                      ? "MONO"
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
                          onClick={() => onReopen(message.tool!)}
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
      <div className="composer-dock">
        <div className="composer-inner">
          <div className="chat-shortcuts" aria-label="Conversation shortcuts">
            {shortcuts.map((s) => (
              <button key={s} onClick={() => onSend(s)}>
                {s}
              </button>
            ))}
            <button
              className="new-chat-action"
              onClick={() => setResetConfirm(true)}
            >
              New chat
            </button>
          </div>
          <ModalOverlay
            isOpen={resetConfirm}
            onOpenChange={setResetConfirm}
            isDismissable
            className="mono-modal-overlay"
          >
            <Modal className="mono-modal">
              <Dialog aria-label="Start a fresh conversation">
                <Heading slot="title">Start a fresh conversation?</Heading>
                <div className="reset-confirm">
                  <span>
                    Start a fresh conversation? Saved requests, provider records
                    and trip preferences will stay.
                  </span>
                  <button
                    onClick={() => {
                      onReset();
                      setResetConfirm(false);
                      inputRef.current?.focus();
                    }}
                  >
                    Start new chat
                  </button>
                  <Button autoFocus onPress={() => setResetConfirm(false)}>
                    Keep chatting
                  </Button>
                </div>
              </Dialog>
            </Modal>
          </ModalOverlay>
          <form
            className="chat-composer"
            onSubmit={(e) => {
              e.preventDefault();
              if (input.trim()) {
                onSend(input.trim());
                setInput("");
              }
            }}
          >
            <span aria-hidden="true">✧</span>
            <FieldInput
              ref={inputRef}
              aria-label="Message MONO"
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
