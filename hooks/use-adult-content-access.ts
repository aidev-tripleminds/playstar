"use client";

import { allowAdultContent } from "@/lib/age-verification/access";
import type { InfoResponse, MeResponse } from "@/lib/api/types";

import { useInfo } from "./use-info";
import { useMe } from "./use-me";

export type AgeVerificationStatus = InfoResponse & Pick<MeResponse, "age_verified">;

/**
 * Age-verification status for the current viewer: the account's `/me` when
 * logged in, otherwise the public location policy (guests are never verified).
 *
 * Call it once per screen, not per tile — `useInfo` refetches on every mount.
 */
export function useAdultContentAccess() {
  const { data: me, isError: meError, isLoggedIn, isSessionPending } = useMe();
  const info = useInfo(!isLoggedIn && !isSessionPending);
  const status: AgeVerificationStatus | undefined = isSessionPending
    ? undefined
    : isLoggedIn
      ? me
      : info.data
        ? { ...info.data, age_verified: false }
        : undefined;

  return {
    status,
    isError: !isSessionPending && (isLoggedIn ? meError : info.isError),
    /** Fails closed: `false` until the status is known. */
    adultContentAllowed: status ? allowAdultContent(status) : false,
  };
}
