"use client";

import { useRouter } from "next/navigation";
import * as React from "react";

import { useMe } from "@/hooks/use-me";
import { mintSessionHandoff } from "@/lib/api/session-handoff";
import { ROUTES } from "@/lib/routes";

/**
 * Marks that THIS TAB was on the funnel without a session.
 *
 * `sessionStorage`, not React state, and that is the whole design. The funnel's
 * four ways to acquire a session do not converge on one client-side moment:
 * email sign-in resolves a promise in place, but Google leaves the origin
 * entirely and comes back through a fresh page load, at which point no in-page
 * state survives to say "this session is new". A per-tab storage key does
 * survive it, and it is the only thing that distinguishes "signed in here, just
 * now" from "arrived already signed in".
 */
const AWAITING_HANDOFF_KEY = "spicestars.funnel.awaiting-handoff";
const HANDOFF_RETRY_MS = 2000;

/** Storage is unavailable in some privacy modes; never let that throw. */
function readFlag(): boolean {
  try {
    return window.sessionStorage.getItem(AWAITING_HANDOFF_KEY) === "1";
  } catch {
    return false;
  }
}

function writeFlag(value: boolean): void {
  try {
    if (value) window.sessionStorage.setItem(AWAITING_HANDOFF_KEY, "1");
    else window.sessionStorage.removeItem(AWAITING_HANDOFF_KEY);
  } catch {
    // No storage: the visitor stays on the funnel signed in and can press on
    // again. Degraded, not broken — and never a thrown error mid-sign-in.
  }
}

/**
 * Carries a visitor who just authenticated ON THE FUNNEL over to the brand's
 * real site, still signed in (funnel-page task 10 / R18).
 *
 * Mounted once, in the funnel's own layout — **not** at the four places a
 * session can appear. `signIn.email`, the auto-login retry, the confirm-email
 * dialog's close and Google's return are four different moments in three
 * different files, and wiring each of them is how one gets missed. This watches
 * the one thing they all produce: a session becoming visible on the funnel.
 *
 * It fires only on a TRANSITION, never on arrival. A visitor who reaches the
 * funnel already signed in is left alone — yanking them to another domain the
 * instant they land would make the page unusable for them, and there is nothing
 * to hand over that they do not already have.
 */
export function useFunnelSessionHandoff(next: string = ROUTES.createAiGirlfriend): void {
  const { isLoggedIn, isSessionPending } = useMe();
  const router = useRouter();
  const startedRef = React.useRef(false);
  const retryTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const [retryAttempt, setRetryAttempt] = React.useState(0);

  React.useEffect(
    () => () => {
      if (retryTimerRef.current !== null) clearTimeout(retryTimerRef.current);
    },
    [],
  );

  React.useEffect(() => {
    // `isSessionPending` is held true through hydration (see `useMe`), so this
    // guard is what stops the first client render from reading "signed out" and
    // arming the flag for someone who was signed in all along.
    if (isSessionPending) return;

    if (!isLoggedIn) {
      writeFlag(true);
      return;
    }

    // Signed in, but this tab never saw the funnel signed out — they arrived
    // with a session. Not our transition; leave them where they are.
    if (!readFlag()) return;
    if (startedRef.current) return;
    startedRef.current = true;

    // Cleared BEFORE the navigation, not after it succeeds. Otherwise pressing
    // Back returns to the funnel with the flag still set and hands them off a
    // second time, which reads as a broken Back button.
    writeFlag(false);

    void (async () => {
      try {
        const handoff = await mintSessionHandoff({ next });
        if (handoff.crossOrigin) {
          // A full page load, because it is a different origin. `router.push`
          // cannot cross one.
          window.location.assign(handoff.url);
        } else {
          // Same origin — nothing was minted, and there is nothing to redeem.
          router.push(handoff.url);
        }
      } catch {
        // Minting failed — a dropped connection, a cold backend, a 500. Put the
        // tab back exactly as it was and schedule another attempt. Without
        // this the visitor is stranded: the flag was
        // cleared before the attempt and `startedRef` latches, so one transient
        // failure would permanently strip this tab of its only route to the
        // product — the funnel layout deliberately renders no navigation out.
        // Still silent: they are signed in with their work attached to their
        // account, so there is nothing for them to act on.
        writeFlag(true);
        startedRef.current = false;
        retryTimerRef.current = setTimeout(() => {
          retryTimerRef.current = null;
          setRetryAttempt((attempt) => attempt + 1);
        }, HANDOFF_RETRY_MS);
      }
    })();
  }, [isLoggedIn, isSessionPending, next, retryAttempt, router]);
}
