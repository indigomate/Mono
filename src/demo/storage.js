// Demo-only browser persistence. No network or production credentials.
const sessionValues = new Map();
const sessionOnlyKeys = new Set();
export function storageScope(key) {
  return sessionOnlyKeys.has(key) ? "session" : "device";
}
export function read(key) {
  if (sessionValues.has(key)) return sessionValues.get(key);
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}
export function write(key, value) {
  sessionValues.set(key, value);
  try {
    localStorage.setItem(key, value);
    sessionOnlyKeys.delete(key);
    return true;
  } catch {
    sessionOnlyKeys.add(key);
    const status = document.getElementById("storage-status");
    if (status)
      status.textContent =
        "Browser storage is unavailable. Changes last for this session only.";
    return false;
  }
}
export function loadArray(key) {
  try {
    const value = JSON.parse(read(key) || "[]");
    return Array.isArray(value)
      ? value.filter(
          (v) =>
            v &&
            typeof v === "object" &&
            (key === "mono-listings"
              ? typeof v.name === "string" &&
                Number.isFinite(v.price) &&
                typeof v.area === "string"
              : typeof v.car === "string" &&
                typeof v.start === "string" &&
                typeof v.end === "string" &&
                Number.isFinite(v.total) &&
                typeof v.status === "string"),
        )
      : [];
  } catch {
    return [];
  }
}
