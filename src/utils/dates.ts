import { parseDate } from "@internationalized/date";

/** Chat and browser storage can contain dates native inputs would reject. */
export function toCalendarDate(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;
  try {
    return parseDate(value);
  } catch {
    return null;
  }
}
export function isISODate(value: string) {
  return toCalendarDate(value) !== null;
}
