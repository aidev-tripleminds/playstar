import { authClient } from "@/lib/auth/auth-client";

import { CLIENT_API_ORIGIN } from "./config";

export type WalletUpdateEvent = { type: "wallet_update"; tokenBalance?: number };
export type SubscriptionUpdateEvent = { type: "subscription_update" } & Record<string, unknown>;

type SubscribeOptions = {
  onWalletUpdate?: (data: WalletUpdateEvent) => void;
  onSubscriptionUpdate?: (data: SubscriptionUpdateEvent) => void;
};

export type WalletEventsSubscription = { ready: Promise<boolean>; unsubscribe: () => void };

function parseFrame<T extends { type: string }>(raw: string, type: T["type"]): T | null {
  try {
    const parsed = JSON.parse(raw) as unknown;
    return parsed && typeof parsed === "object" && (parsed as { type?: unknown }).type === type
      ? (parsed as T)
      : null;
  } catch {
    return null;
  }
}

export function subscribeToWalletEvents({
  onWalletUpdate,
  onSubscriptionUpdate,
}: SubscribeOptions): WalletEventsSubscription {
  let source: EventSource | null = null;
  let cancelled = false;
  let settleReady: (ready: boolean) => void = () => {};
  const ready = new Promise<boolean>((resolve) => {
    settleReady = resolve;
  });

  void (async () => {
    let token: string | undefined;
    try {
      const { data } = await authClient.getSession();
      token = data?.session.token;
    } catch {
      settleReady(false);
      return;
    }

    if (cancelled || !token) {
      settleReady(false);
      return;
    }

    try {
      source = new EventSource(
        `${CLIENT_API_ORIGIN}/api/v1/payments/stream/wallet?token=${encodeURIComponent(token)}`,
      );
    } catch {
      settleReady(false);
      return;
    }

    source.addEventListener("open", () => settleReady(true), { once: true });
    source.addEventListener("error", () => settleReady(false), { once: true });
    source.addEventListener("wallet_update", (event) => {
      const data = parseFrame<WalletUpdateEvent>(
        (event as MessageEvent<string>).data,
        "wallet_update",
      );
      if (data) onWalletUpdate?.(data);
    });
    source.addEventListener("subscription_update", (event) => {
      const data = parseFrame<SubscriptionUpdateEvent>(
        (event as MessageEvent<string>).data,
        "subscription_update",
      );
      if (data) onSubscriptionUpdate?.(data);
    });
  })();

  return {
    ready,
    unsubscribe: () => {
      cancelled = true;
      settleReady(false);
      source?.close();
      source = null;
    },
  };
}
