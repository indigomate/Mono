import { useId, useState } from "react";
export interface ChatDetail {
  id: string;
  title: string;
  value: string;
  detail: string;
  onEdit: () => void;
}
/** Adapted expandable-card pattern: domain data stays outside the transcript. */
export function ChatDetailCards({ cards }: { cards: ChatDetail[] }) {
  const [active, setActive] = useState<string | null>(null);
  const prefix = useId();
  return (
    <div className="chat-detail-cards">
      <div className="chat-detail-grid">
        {cards.map((card) => (
          <button
            type="button"
            key={card.id}
            aria-expanded={active === card.id}
            aria-controls={`${prefix}-${card.id}`}
            onClick={() => setActive(active === card.id ? null : card.id)}
          >
            <span>{card.title}</span>
            <strong>{card.value}</strong>
            <small>{active === card.id ? "Close −" : "Details +"}</small>
          </button>
        ))}
      </div>
      {cards.map(
        (card) =>
          active === card.id && (
            <section
              id={`${prefix}-${card.id}`}
              key={card.id}
              className="chat-detail-expanded"
              aria-label={`${card.title} details`}
            >
              <h4>{card.title}</h4>
              <p>{card.value}</p>
              <small>{card.detail}</small>
              <button
                type="button"
                className="text-button"
                data-context-action
                onClick={card.onEdit}
              >
                Edit {card.title.toLowerCase()} in chat →
              </button>
            </section>
          ),
      )}
    </div>
  );
}
