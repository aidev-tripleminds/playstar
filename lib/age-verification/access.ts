import type { MeResponse } from "@/lib/api/types";

/** Combine the location requirement with the account's confirmed verification. */
export function allowAdultContent(
  status: Pick<MeResponse, "age_verification_needed" | "age_verified">,
): boolean {
  return !status.age_verification_needed || status.age_verified;
}
