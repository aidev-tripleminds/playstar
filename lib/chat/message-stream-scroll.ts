/**
 * Scroll primitives for the chat message stream.
 *
 * The open chat scrolls its message list. Callers should prefer these helpers
 * over `scrollIntoView`, which can target the wrong ancestor around sticky chrome.
 *
 * Between md and lg the app shell scrolls `<main>` (not the window) while chat
 * still uses "page" scroll mode — resolve that to the nearest overflow ancestor.
 */

export type ChatScrollRoot = { type: "element"; element: HTMLElement } | { type: "window" };

export type ChatScrollMetrics = {
  scrollTop: number;
  scrollHeight: number;
  clientHeight: number;
};

/** Distance from the bottom (px) that still counts as "pinned" to latest messages. */
export const CHAT_NEAR_BOTTOM_THRESHOLD_PX = 80;

function isOverflowYScrollable(style: CSSStyleDeclaration): boolean {
  return (
    style.overflowY === "auto" || style.overflowY === "scroll" || style.overflowY === "overlay"
  );
}

/**
 * Walk ancestors to find the element that actually scrolls the page shell
 * (e.g. `main-layout-main` at md+). Returns null when the document/window scrolls.
 */
export function findNearestOverflowYScrollParent(start: HTMLElement | null): HTMLElement | null {
  if (!start || typeof window === "undefined") {
    return null;
  }

  let node: HTMLElement | null = start.parentElement;
  while (node) {
    if (isOverflowYScrollable(window.getComputedStyle(node))) {
      return node;
    }
    node = node.parentElement;
  }

  return null;
}

export function getChatScrollMetrics(root: ChatScrollRoot): ChatScrollMetrics {
  if (root.type === "element") {
    const { element } = root;
    return {
      scrollTop: element.scrollTop,
      scrollHeight: element.scrollHeight,
      clientHeight: element.clientHeight,
    };
  }

  const scrollingElement = document.scrollingElement ?? document.documentElement;
  return {
    scrollTop: window.scrollY,
    scrollHeight: scrollingElement.scrollHeight,
    clientHeight: window.innerHeight,
  };
}

export function getDistanceFromBottom(metrics: ChatScrollMetrics): number {
  return Math.max(0, metrics.scrollHeight - metrics.scrollTop - metrics.clientHeight);
}

export function isNearChatBottom(
  root: ChatScrollRoot,
  thresholdPx: number = CHAT_NEAR_BOTTOM_THRESHOLD_PX,
): boolean {
  return getDistanceFromBottom(getChatScrollMetrics(root)) <= thresholdPx;
}

export function scrollChatToBottom(root: ChatScrollRoot): void {
  if (root.type === "element") {
    const { element } = root;
    element.scrollTop = element.scrollHeight;
    return;
  }

  const scrollingElement = document.scrollingElement ?? document.documentElement;
  const top = Math.max(0, scrollingElement.scrollHeight - window.innerHeight);
  window.scrollTo({ top, left: 0, behavior: "auto" });
}

/** Reset page scroll when opening the mobile/tablet active chat pane. */
export function resetChatPageScroll(): void {
  const main = document.querySelector<HTMLElement>('[data-slot="main-layout-main"]');
  if (main && isOverflowYScrollable(window.getComputedStyle(main))) {
    main.scrollTop = 0;
  }

  window.scrollTo({ top: 0, left: 0, behavior: "auto" });
}

export function resolveChatScrollRoot(
  mode: "element" | "window",
  element: HTMLElement | null,
): ChatScrollRoot | null {
  if (mode === "element") {
    if (!element) {
      return null;
    }
    return { type: "element", element };
  }

  // "window" means page scroll. At md+ the shell nests overflow on <main>, so
  // pin/stick against that ancestor instead of a non-scrolling window.
  const nested = findNearestOverflowYScrollParent(element);
  if (nested) {
    return { type: "element", element: nested };
  }

  return { type: "window" };
}
