"use client";

import { useCallback, useRef, useState } from "react";

import { type RequireAuthOptions, useAuthGate } from "@/components/common/auth/auth-gate";

export type ServerSwitchOptions = {
  /** What the switch is about (a media id, a character id). Undefined: nothing to switch. */
  id: string | undefined;
  /** The server's state for `id`, when known. */
  serverValue: boolean | undefined;
  /**
   * Sends the wanted state for `id`. On success it must also update wherever
   * `serverValue` comes from (a query cache), because the switch hands back to
   * `serverValue` once its requests settle.
   */
  send: (id: string, next: boolean) => Promise<unknown>;
  /** Login/Signup options for a guest's click. */
  authOptions?: Omit<RequireAuthOptions, "onSuccess">;
};

/**
 * A yes/no the server owns (an image saved, a character followed), used as a
 * switch. A click shows the new state at once and sends it. Requests for one id
 * run in click order, so the last click wins. Once the latest request settles
 * the switch shows `serverValue` again: the new state on success (`send`
 * updated it), the last state the server confirmed on failure, and any later
 * server change after that. A guest is asked to log in first, and the switch is
 * turned on once they are.
 */
/**
 * Request chains per id, shared by every switch so that closing a preview and
 * reopening it does not let a new request overtake one still in flight.
 */
const queues = new Map<string, Promise<unknown>>();

export function useServerSwitch({ id, serverValue, send, authOptions }: ServerSwitchOptions) {
  const { requireAuth } = useAuthGate();
  /** The clicked state per id, held only while that id has requests in flight. */
  const [pending, setPending] = useState<Record<string, boolean>>({});
  const latest = useRef(new Map<string, number>());
  const on = id === undefined ? false : (pending[id] ?? serverValue ?? false);

  const apply = useCallback(
    (target: string, next: boolean) => {
      setPending((prev) => ({ ...prev, [target]: next }));
      const request = (latest.current.get(target) ?? 0) + 1;
      latest.current.set(target, request);
      const settle = () => {
        if (latest.current.get(target) !== request) return;
        setPending((prev) => {
          const rest = { ...prev };
          delete rest[target];
          return rest;
        });
      };
      const previous = queues.get(target) ?? Promise.resolve();
      queues.set(target, previous.then(() => send(target, next)).then(settle, settle));
    },
    [send],
  );

  const toggle = useCallback(() => {
    if (id === undefined) return;
    if (requireAuth({ ...authOptions, onSuccess: () => apply(id, true) })) apply(id, !on);
  }, [apply, authOptions, id, on, requireAuth]);

  return { on, toggle };
}
