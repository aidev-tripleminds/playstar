/**
 * Session-scoped "consumed" flag for the /premium leave-retention flow.
 *
 * Once the user completes (claim or final skip), further leaves in this tab
 * session pass through. A new browser session re-arms the flow.
 *
 * Storage failures fail open (treat as consumed) so we never trap the user.
 */

export const PREMIUM_LEAVE_RETENTION_CONSUMED_KEY = "spicestars:premium-leave-retention:consumed";

const CONSUMED_VALUE = "1";

function isBrowser(): boolean {
  return typeof window !== "undefined";
}

export function hasPremiumLeaveRetentionBeenConsumed(): boolean {
  if (!isBrowser()) {
    return true;
  }

  try {
    return sessionStorage.getItem(PREMIUM_LEAVE_RETENTION_CONSUMED_KEY) === CONSUMED_VALUE;
  } catch {
    // Private mode / blocked storage — fail open.
    return true;
  }
}

export function markPremiumLeaveRetentionConsumed(): void {
  if (!isBrowser()) {
    return;
  }

  try {
    sessionStorage.setItem(PREMIUM_LEAVE_RETENTION_CONSUMED_KEY, CONSUMED_VALUE);
  } catch {
    // Ignore write failures; navigation still proceeds.
  }
}

/** Test helper — clears the session flag. */
export function clearPremiumLeaveRetentionConsumed(): void {
  if (!isBrowser()) {
    return;
  }

  try {
    sessionStorage.removeItem(PREMIUM_LEAVE_RETENTION_CONSUMED_KEY);
  } catch {
    // Ignore.
  }
}
