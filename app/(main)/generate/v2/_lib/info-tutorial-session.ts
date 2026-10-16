/**
 * Session-scoped flag for the generate prompt-box info tutorial.
 *
 * After the user dismisses the popup once, the info button stays dark for the
 * rest of this tab session. A new browser session re-arms the highlight.
 */

export const GENERATE_INFO_TUTORIAL_SEEN_KEY = "spicestars:generate:info-tutorial:seen";

const SEEN_VALUE = "1";

type Listener = () => void;

const listeners = new Set<Listener>();

function isBrowser() {
  return typeof window !== "undefined";
}

function emitGenerateInfoTutorialSeen() {
  for (const listener of listeners) {
    listener();
  }
}

export function subscribeGenerateInfoTutorialSeen(onStoreChange: () => void): () => void {
  listeners.add(onStoreChange);
  return () => {
    listeners.delete(onStoreChange);
  };
}

export function hasSeenGenerateInfoTutorial(): boolean {
  if (!isBrowser()) {
    return false;
  }

  try {
    return sessionStorage.getItem(GENERATE_INFO_TUTORIAL_SEEN_KEY) === SEEN_VALUE;
  } catch {
    return false;
  }
}

export function markGenerateInfoTutorialSeen(): void {
  if (!isBrowser()) {
    return;
  }

  try {
    sessionStorage.setItem(GENERATE_INFO_TUTORIAL_SEEN_KEY, SEEN_VALUE);
  } catch {
    // Ignore write failures; the highlight just stays for this visit.
  }

  emitGenerateInfoTutorialSeen();
}

/** Test helper — clears the session flag. */
export function clearGenerateInfoTutorialSeen(): void {
  if (!isBrowser()) {
    return;
  }

  try {
    sessionStorage.removeItem(GENERATE_INFO_TUTORIAL_SEEN_KEY);
  } catch {
    // Ignore.
  }

  emitGenerateInfoTutorialSeen();
}
