import { useEffect, useState } from "react";
import {
  Button,
  Calendar,
  CalendarCell,
  CalendarGrid,
  Heading,
} from "react-aria-components";
import {
  today as calendarToday,
  getLocalTimeZone,
} from "@internationalized/date";
import { toCalendarDate } from "../../utils/dates";

export function CalendarPicker({
  label,
  value,
  min,
  onChange,
  initiallyOpen = false,
}: {
  initiallyOpen?: boolean;
  label: string;
  value: string;
  min: string;
  onChange: (value: string) => void;
}) {
  const selectedDate = toCalendarDate(value);
  const minimumDate = toCalendarDate(min) || calendarToday(getLocalTimeZone());
  const [open, setOpen] = useState(initiallyOpen);
  const [focused, setFocused] = useState(
    () =>
      toCalendarDate(value) ||
      toCalendarDate(min) ||
      calendarToday(getLocalTimeZone()),
  );
  useEffect(() => {
    setFocused(
      toCalendarDate(value) ||
        toCalendarDate(min) ||
        calendarToday(getLocalTimeZone()),
    );
  }, [value, min]);
  return (
    <details
      className="mono-calendar-picker"
      open={open}
      onToggle={(e) => setOpen(e.currentTarget.open)}
    >
      <summary>Choose {label.toLowerCase()} on a calendar</summary>
      <Calendar
        aria-label={label}
        onPointerDownCapture={() => {
          // Native date editors can scroll themselves back into view during a
          // calendar press. Commit/blur the editor before React Aria handles it.
          const active = document.activeElement;
          if (active instanceof HTMLInputElement && active.type === "date")
            active.blur();
        }}
        focusedValue={focused}
        onFocusChange={setFocused}
        value={selectedDate}
        minValue={minimumDate}
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
      {value && !selectedDate && (
        <p className="form-error" role="alert">
          Enter a valid date in YYYY-MM-DD format.
        </p>
      )}
    </details>
  );
}
