/**
 * Browser-history helpers for modal back-button trapping.
 *
 * When a modal opens we push a same-URL history entry tagged with a stack of
 * modal ids. Browser Back pops that entry and closes only the topmost modal,
 * without leaving the current page.
 */

export const MODAL_HISTORY_STACK_KEY = "__ssModalStack" as const;

export type ModalHistoryState = {
  [MODAL_HISTORY_STACK_KEY]?: string[];
  [key: string]: unknown;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

/** Read the modal stack from a History state value (or current history.state). */
export function getModalHistoryStack(state: unknown = window.history.state): string[] {
  if (!isRecord(state)) {
    return [];
  }

  const stack = state[MODAL_HISTORY_STACK_KEY];
  return Array.isArray(stack) ? stack.filter((id): id is string => typeof id === "string") : [];
}

/** Merge a modal stack into existing history state without dropping Next.js router fields. */
export function withModalHistoryStack(state: unknown, stack: string[]): ModalHistoryState {
  const base: ModalHistoryState = isRecord(state) ? { ...state } : {};

  if (stack.length === 0) {
    delete base[MODAL_HISTORY_STACK_KEY];
    return base;
  }

  base[MODAL_HISTORY_STACK_KEY] = stack;
  return base;
}

/** Push a same-URL history entry that adds `modalId` to the modal stack. */
export function pushModalHistoryEntry(modalId: string): void {
  const nextStack = [...getModalHistoryStack(), modalId];
  window.history.pushState(withModalHistoryStack(window.history.state, nextStack), "");
}

/**
 * Remove a modal history entry after a normal (non-back-button) close.
 * If this modal is on top, `history.back()` restores the previous page entry.
 * Otherwise the id is stripped via `replaceState` (nested / out-of-order close).
 */
export function dismissModalHistoryEntry(modalId: string): "back" | "replace" | "noop" {
  const stack = getModalHistoryStack();

  if (!stack.includes(modalId)) {
    return "noop";
  }

  if (stack[stack.length - 1] === modalId) {
    window.history.back();
    return "back";
  }

  const nextStack = stack.filter((id) => id !== modalId);
  window.history.replaceState(withModalHistoryStack(window.history.state, nextStack), "");
  return "replace";
}

/**
 * Drop every modal marker from the current history entry, so closing those
 * modals no longer rewinds history.
 *
 * Call this immediately before navigating away from a modal that is still open.
 * The close that follows would otherwise reach `dismissModalHistoryEntry` and
 * `history.back()` straight over the navigation — popping the page you just
 * pushed and silently returning the user to where they started. With the
 * markers gone that cleanup no-ops and the navigation stands.
 */
export function releaseModalHistoryForNavigation(): void {
  if (getModalHistoryStack().length === 0) {
    return;
  }

  window.history.replaceState(withModalHistoryStack(window.history.state, []), "");
}

/** True when `modalId` is no longer present in the current history stack. */
export function isModalHistoryEntryPopped(modalId: string, state: unknown = window.history.state) {
  return !getModalHistoryStack(state).includes(modalId);
}

/**
 * Run `navigate` once the modal that is closing has popped its history entry.
 *
 * `releaseModalHistoryForNavigation` suits a push: it leaves the modal's
 * same-URL entry behind, which is harmless beneath a new page. A REPLACE must
 * instead land on the page's own entry — replacing the modal's entry would
 * leave `[source, page, destination]`, so Back returns to the page the user
 * just left. Call this right before closing the modal; its normal close
 * `history.back()`s off the entry, and the navigation follows that pop. With
 * no modal entry open, `navigate` runs immediately.
 */
export function navigateAfterModalHistoryPops(navigate: () => void): void {
  if (getModalHistoryStack().length === 0) {
    navigate();
    return;
  }
  // Deferred a tick so the router finishes its own popstate handling first.
  window.addEventListener("popstate", () => window.setTimeout(navigate, 0), { once: true });
}
