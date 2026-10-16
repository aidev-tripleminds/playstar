"use client";

import { usePathname } from "next/navigation";
import Script from "next/script";
import { useEffect, useRef, useState } from "react";

import { showToast } from "@/components/common/general/toast/toast";
import { useBootstrap } from "@/hooks/use-bootstrap";
import { apiFetch, ApiRequestError } from "@/lib/api/client";
import { useSession } from "@/lib/auth/auth-client";
import { ACCOUNT_PENDING_DELETION_CODE } from "@/lib/auth/pending-deletion";
import { buildSocialCallbackUrl } from "@/lib/auth/return-to";

/** The subset of Google's browser API used here; credentials never leave our own origin. */
type GoogleIdentity = {
  initialize: (options: {
    client_id: string;
    nonce: string;
    callback: (response: { credential: string }) => void;
    auto_select: boolean;
    use_fedcm_for_prompt: boolean;
  }) => void;
  prompt: () => void | Promise<void>;
  cancel: () => void;
};

function googleIdentity(): GoogleIdentity | undefined {
  return (window as Window & { google?: { accounts?: { id?: GoogleIdentity } } }).google?.accounts
    ?.id;
}

/** One attempt per page lifetime. Google/browser dismissal and cooldown policies govern display. */
export function GoogleOneTap() {
  const { data: session, isPending, error } = useSession();
  const { data: bootstrap } = useBootstrap();
  const pathname = usePathname();
  const [scriptReady, setScriptReady] = useState(false);
  const attempted = useRef(false);
  const clientId = bootstrap?.auth.google?.clientId;
  const eligible =
    !isPending &&
    !error &&
    !session?.user &&
    !!clientId &&
    !(pathname === "/auth" || pathname.startsWith("/auth/"));

  useEffect(() => {
    const identity = googleIdentity();
    // Hide One Tap when the visitor signs in or hits an auth route. Do not
    // cancel from effect cleanup: React Strict Mode remounts in development
    // and aborting FedCM mid-flight is logged as
    // `[GSI_LOGGER]: FedCM get() rejects with NetworkError`.
    if (!eligible) {
      if (attempted.current) identity?.cancel();
      return;
    }
    if (!scriptReady || !identity || attempted.current || !clientId) return;
    let active = true;
    let submitting = false;
    const controller = new AbortController();

    async function prompt() {
      try {
        const { nonce } = await apiFetch<{ nonce: string }>("/api/v1/auth/one-tap/nonce", {
          method: "POST",
          signal: controller.signal,
        });
        if (!active) return;
        identity!.initialize({
          client_id: clientId!,
          nonce,
          auto_select: false,
          use_fedcm_for_prompt: true,
          callback: async ({ credential }) => {
            if (!active || submitting) return;
            submitting = true;
            try {
              await apiFetch("/api/v1/auth/one-tap/callback", {
                method: "POST",
                body: JSON.stringify({ idToken: credential }),
              });
              // Reload through this domain so Better Auth and all user queries see the new cookie.
              window.location.assign(buildSocialCallbackUrl());
            } catch (error) {
              showToast({
                type: "error",
                text:
                  error instanceof ApiRequestError && error.code === ACCOUNT_PENDING_DELETION_CODE
                    ? error.message
                    : "Google sign-in could not be completed. Please use Log in to try again.",
                error,
              });
            }
          },
        });
        attempted.current = true;
        await identity!.prompt();
      } catch {
        // A blocked script, unavailable backend, dismissed prompt, or FedCM
        // NetworkError must not interrupt browsing. GIS still logs its own
        // `[GSI_LOGGER]` line when the browser declines to issue a token.
      }
    }

    void prompt();
    return () => {
      active = false;
      controller.abort();
    };
  }, [clientId, eligible, scriptReady]);

  if (!eligible) return null;
  return (
    <Script src="https://accounts.google.com/gsi/client" onReady={() => setScriptReady(true)} />
  );
}
