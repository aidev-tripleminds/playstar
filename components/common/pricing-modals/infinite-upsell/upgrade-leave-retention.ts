/**
 * Session-scoped "consumed" flag for the /upgrade leave-retention flow.
 *
 * Once the user completes (Continue or final Skip), further leaves in this tab
 * session pass through. A new browser session re-arms the flow.
 *
 * Storage failures fail open (treat as consumed) so we never trap the user.
 */

export const UPGRADE_LEAVE_RETENTION_CONSUMED_KEY = "spicestars:upgrade-leave-retention:consumed";

const CONSUMED_VALUE = "1";

function isBrowser(): boolean {
  return typeof window !== "undefined";
}

export function hasUpgradeLeaveRetentionBeenConsumed(): boolean {
  if (!isBrowser()) {
    return true;
  }

  try {
    return sessionStorage.getItem(UPGRADE_LEAVE_RETENTION_CONSUMED_KEY) === CONSUMED_VALUE;
  } catch {
    return true;
  }
}

export function markUpgradeLeaveRetentionConsumed(): void {
  if (!isBrowser()) {
    return;
  }

  try {
    sessionStorage.setItem(UPGRADE_LEAVE_RETENTION_CONSUMED_KEY, CONSUMED_VALUE);
  } catch {
    // Ignore write failures; navigation still proceeds.
  }
}

/** Test helper — clears the session flag. */
export function clearUpgradeLeaveRetentionConsumed(): void {
  if (!isBrowser()) {
    return;
  }

  try {
    sessionStorage.removeItem(UPGRADE_LEAVE_RETENTION_CONSUMED_KEY);
  } catch {
    // Ignore.
  }
}
