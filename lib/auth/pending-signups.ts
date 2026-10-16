/**
 * Addresses this browser has already put through "Join for Free" and that
 * have not been verified since.
 *
 * Why this exists: the backend cannot tell us. A second signup for an
 * existing, still-unverified address returns a *fake* 200 — a synthesised
 * user object, no account created, and (crucially) NO confirmation email
 * sent, because the send hangs off the real user-create hook. That response
 * is deliberately indistinguishable from a genuine new signup
 * (anti-enumeration: a distinguishable one would let anyone probe which
 * addresses have accounts). So the only place that knows a Join is a repeat
 * is the browser that made the first one — and it has to survive a page
 * reload, which a component-lifetime ref does not.
 *
 * Consequence for the confirm-email dialog: a first Join really did send an
 * email (Okay), a repeat Join sent nothing at all (Resend — the only action
 * that gets the user an email). See `confirm-email-copy.ts`.
 *
 * Best-effort by nature: another browser, a cleared store, private browsing,
 * or the storage cap below all fall back to treating the Join as new. That
 * degrades to the old behaviour (Okay), never to a wrong claim about
 * something we know.
 */

import { readBrowserStorage, writeBrowserStorage } from "@/lib/browser-storage";

const STORAGE_KEY = "omnipink:pending-signups";

/**
 * Keeps the entry from growing without bound on a shared/kiosk browser.
 * Set high enough that a real user's own unverified signups are never the
 * ones FIFO-evicted — only a kiosk-scale burst of distinct addresses hits it.
 */
const MAX_ENTRIES = 200;

function normalize(email: string): string {
  return email.trim().toLowerCase();
}

function readAll(): string[] {
  const raw = readBrowserStorage(STORAGE_KEY);
  if (!raw) return [];
  try {
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed)
      ? parsed.filter((item): item is string => typeof item === "string")
      : [];
  } catch {
    return [];
  }
}

function writeAll(emails: string[]): void {
  writeBrowserStorage(STORAGE_KEY, JSON.stringify(emails.slice(-MAX_ENTRIES)));
}

/**
 * Checks whether `email` was already pending and remembers it for next time,
 * in a single read-modify-write (avoids reading the store twice per Join).
 * Returns whether it was already pending.
 */
export function checkAndRememberPendingSignup(email: string): boolean {
  const normalized = normalize(email);
  const existing = readAll();
  const alreadyPending = existing.includes(normalized);
  if (!alreadyPending) writeAll([...existing, normalized]);
  return alreadyPending;
}

/**
 * Drop an address once it is known to be verified (the verify-email landing
 * page), so a later signup attempt for it is judged on its own merits rather
 * than against a stale "still pending" flag.
 */
export function forgetPendingSignup(email: string): void {
  const normalized = normalize(email);
  const existing = readAll();
  if (!existing.includes(normalized)) return;
  writeAll(existing.filter((item) => item !== normalized));
}
