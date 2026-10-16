/**
 * Session-scoped flag for the pre-launch welcome dialog.
 *
 * The notice auto-opens once per tab session so signing in explains itself
 * without nagging on every navigation. Attempting a locked route opens it
 * again regardless — that is a direct answer to something the user just did,
 * not a welcome.
 */

export const PRE_LAUNCH_NOTICE_SEEN_KEY = "spicestars:pre-launch:notice-seen";

const SEEN_VALUE = "1";

function isBrowser() {
  return typeof window !== "undefined";
}

export function hasSeenPreLaunchNotice(): boolean {
  if (!isBrowser()) {
    return false;
  }

  try {
    return sessionStorage.getItem(PRE_LAUNCH_NOTICE_SEEN_KEY) === SEEN_VALUE;
  } catch {
    // Private mode / blocked storage: treat as unseen. Showing the welcome
    // again is a far better failure than never showing it.
    return false;
  }
}

export function markPreLaunchNoticeSeen(): void {
  if (!isBrowser()) {
    return;
  }

  try {
    sessionStorage.setItem(PRE_LAUNCH_NOTICE_SEEN_KEY, SEEN_VALUE);
  } catch {
    // Ignore write failures; the welcome just shows again next navigation.
  }
}

/** Test helper — clears the session flag. */
export function clearPreLaunchNoticeSeen(): void {
  if (!isBrowser()) {
    return;
  }

  try {
    sessionStorage.removeItem(PRE_LAUNCH_NOTICE_SEEN_KEY);
  } catch {
    // Ignore.
  }
}
