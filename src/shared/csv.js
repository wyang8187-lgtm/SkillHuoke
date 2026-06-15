export function csvEscape(value) {
  return `"${String(value ?? "").replaceAll('"', '""')}"`;
}
