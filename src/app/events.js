export function bindAction(element, eventName, handler) {
  if (!element || typeof handler !== "function") return () => {};
  element.addEventListener(eventName, handler);
  return () => element.removeEventListener(eventName, handler);
}
