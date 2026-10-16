import { apiFetch } from "./client";

/**
 * Consent proof: `POST /api/v1/consent`.
 *
 * Source of truth: `omnipink-backend/src/modules/consent/routes.ts`.
 *
 * The consent cookies this app writes are host-only and SameSite=Lax on the app
 * origin, and the API lives on a different origin — so they are never attached
 * to a backend request. Those cookies drive the UI gates; the durable, auditable
 * proof only exists if we post it here explicitly.
 *
 * The endpoint is public: the age gate is the first thing a visitor sees, long
 * before they can register. The backend keys the record on its own `vsid`
 * visitor-session cookie and re-attributes it to the account at login, so a
 * guest's consent is not lost.
 */

/** Which cookie categories the user accepted on the banner. */
export type CookieConsentChoice = "all" | "necessary";

export type ConsentRecordInput = { type: "age" } | { type: "cookies"; choice: CookieConsentChoice };

/**
 * Record a consent event, best-effort.
 *
 * Never rejects and never blocks the gate: a visitor who confirmed their age
 * must get into the site whether or not the audit write reached the backend.
 *
 * @param consentedAt ISO timestamp of the click — pass the one already stored in
 *   the local cookie so the two records agree. The backend treats it as advisory
 *   (it stamps its own authoritative time).
 */
export async function recordConsent(input: ConsentRecordInput, consentedAt: string): Promise<void> {
  try {
    await apiFetch("/api/v1/consent", {
      method: "POST",
      body: JSON.stringify({ ...input, consentedAt }),
    });
  } catch {
    // Best-effort, see above. No report here: `fetchBackend` reports a network
    // or proxy failure, and the backend logs and reports its own answer.
  }
}
