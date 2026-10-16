import { apiFetch } from "./client";

export type AccountDeletionResponse = {
  deletionRequestedAt: string;
  restorableUntil: string;
  restoreWindowDays: number;
};

export function requestAccountDeletion(): Promise<AccountDeletionResponse> {
  return apiFetch<AccountDeletionResponse>("/api/v1/user/account", {
    method: "DELETE",
    body: JSON.stringify({ confirmation: "DELETE" }),
  });
}
