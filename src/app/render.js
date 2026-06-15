export function renderText(element, value) {
  if (!element) return;
  element.textContent = String(value ?? "");
}
