import { apiFetch } from "./client";

export type SubscriptionResponse = {
  status: string;
  isPremium: boolean;
  planCode: string | null;
  interval: "monthly" | "quarterly" | "yearly" | null;
  currentPeriodStart: string | null;
  currentPeriodEnd: string | null;
  cancelAtPeriodEnd: boolean;
  pendingPlanCode: string | null;
  totalCoinsRewarded: number;
  createdAt: string;
} | null;

export function fetchSubscription(): Promise<SubscriptionResponse> {
  return apiFetch<SubscriptionResponse>("/api/v1/subscription/me");
}

export function resumeSubscription(): Promise<SubscriptionResponse> {
  return apiFetch<SubscriptionResponse>("/api/v1/subscription/resume", {
    method: "POST",
  });
}
