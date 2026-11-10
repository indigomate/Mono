import { useEffect, useState } from "react";
import {
  Button,
  Calendar,
  CalendarCell,
  CalendarGrid,
  Heading,
} from "react-aria-components";
import { parseDate } from "@internationalized/date";

export function CalendarPicker({
  label,
  value,
  min,
  onChange,
}: {
  label: string;
  value: string;
  min: string;
  onChange: (value: string) => void;
}) {
  const [focused, setFocused] = useState(() => parseDate(value || min));
  useEffect(() => {
    setFocused(parseDate(value || min));
  }, [value, min]);
  return (
    <details className="mono-calendar-picker">
      <summary>Choose {label.toLowerCase()} on a calendar</summary>
      <Calendar
        aria-label={label}
        focusedValue={focused}
        onFocusChange={setFocused}
        value={value ? parseDate(value) : null}
        minValue={parseDate(min)}
        onChange={(date) => onChange(date.toString())}
      >
        <header>
          <Button slot="previous" aria-label="Previous month">
            ←
          </Button>
          <Heading />
          <Button slot="next" aria-label="Next month">
            →
          </Button>
        </header>
        <CalendarGrid>{(date) => <CalendarCell date={date} />}</CalendarGrid>
      </Calendar>
    </details>
  );
}
