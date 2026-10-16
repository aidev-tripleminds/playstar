/** Wait for the previous Vaul drawer to finish closing before opening the next. */
export const MODAL_HANDOFF_DELAY_MS = 350;

export function scheduleModalHandoff(openNext: () => void): () => void {
  const timeoutId = window.setTimeout(openNext, MODAL_HANDOFF_DELAY_MS);
  return () => window.clearTimeout(timeoutId);
}
