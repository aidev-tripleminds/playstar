import { apiFetch } from "./client";

/**
 * Cross-origin session handoff (funnel-page task 10 / R18).
 *
 * The funnel domain and the brand's real site are different registrable domains,
 * so no cookie can span them by any mechanism. A visitor who authenticates on
 * the funnel holds a session there and none at all where the product lives.
 * These two calls are the single-use, seconds-lived credential that carries them
 * across.
 *
 * **Both go through the app's OWN origin.** `apiFetch` builds its URL from
 * `CLIENT_API_ORIGIN`, which in the browser is `window.location.origin`, and
 * `next.config.ts` rewrites `/api/*` to the backend server-side. That is not a
 * stylistic preference: a `Set-Cookie` returned from the backend's own domain is
 * a third-party cookie, silently dropped by every browser on iOS (BACK-54).
 * Calling `API_BASE_URL` directly here would leave the session on a domain the
 * app cannot see, and this whole feature would have achieved nothing.
 */

/** The mint endpoint's two shapes — see `crossOrigin`. */
export type MintedHandoff =
  | {
      /**
       * There was an origin boundary. `url` is an ABSOLUTE address on the
       * brand's real site, carrying the credential. Navigate to it with a full
       * page load; a client-side route change cannot cross an origin.
       */
      crossOrigin: true;
      url: string;
    }
  | {
      /**
       * The funnel and the destination share an origin, so **nothing was
       * minted** (R18.10, D24) — true on `localhost`, on preview deployments,
       * and if the funnel ever moves to a path on the main site. `url` is a
       * relative path; just route to it.
       */
      crossOrigin: false;
      url: string;
    };

/**
 * Mint a credential for the session this browser already holds.
 *
 * Nothing identifying anybody is passed in, deliberately: the credential is
 * minted for the session making the request, and a body that could name a user
 * is a body that will eventually be trusted to.
 *
 * `origin` is `window.location.origin` and decides ONE thing — whether there is
 * a boundary to cross at all. It cannot influence where the visitor is sent;
 * that address is built on the server from the brand's own recorded site
 * address. Only the client knows its own scheme and port, which is why it is
 * sent rather than reconstructed from proxy headers.
 */
export function mintSessionHandoff(input: { next: string }): Promise<MintedHandoff> {
  return apiFetch<MintedHandoff>("/api/v1/auth/handoff", {
    method: "POST",
    body: JSON.stringify({
      next: input.next,
      origin: typeof window === "undefined" ? undefined : window.location.origin,
    }),
  });
}

/**
 * Spend a credential and receive a session cookie **on this origin**.
 *
 * The token is the whole input. `nextPath` comes back from the stored row — the
 * value validated when the credential was minted — so the landing page can
 * prefer it over the `next` in its own address bar, which a visitor can edit.
 *
 * Every refusal (expired, already spent, never existed, wrong brand, originating
 * session ended) is the same 401 with the same body: there is nothing here to
 * branch on, and nothing worth telling the visitor.
 */
export function redeemSessionHandoff(token: string): Promise<{ nextPath: string }> {
  return apiFetch<{ nextPath: string }>("/api/v1/auth/handoff/redeem", {
    method: "POST",
    body: JSON.stringify({ token }),
  });
}
