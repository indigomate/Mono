import { read, write, storageScope } from "./storage";
import { inventory } from "./marketplace";
const key = "mono-customer-saved-cars-v1";
export function loadSavedCars(): number[] {
  try {
    const ids: unknown = JSON.parse(read(key) || "[]");
    return Array.isArray(ids)
      ? [
          ...new Set(
            ids.filter(
              (id): id is number =>
                typeof id === "number" && inventory.some((c) => c.id === id),
            ),
          ),
        ]
      : [];
  } catch {
    return [];
  }
}
export function saveCars(ids: number[]) {
  write(key, JSON.stringify(ids));
}
export function savedCarsScope(): "session" | "device" {
  return storageScope(key);
}
