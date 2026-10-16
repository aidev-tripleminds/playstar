export const ACCOUNT_PENDING_DELETION_CODE = "ACCOUNT_PENDING_DELETION";

export function formatRestoreDeadline(restorableUntil: string): string | null {
  const deadline = new Date(restorableUntil);
  if (Number.isNaN(deadline.getTime())) return null;
  return new Intl.DateTimeFormat(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(deadline);
}

export function pendingDeletionMessage(restorableUntil?: string | null): string {
  const deadline = restorableUntil ? formatRestoreDeadline(restorableUntil) : null;
  return deadline
    ? `This account is scheduled for deletion. Contact support before ${deadline} to restore it.`
    : "This account is scheduled for deletion. Contact support to ask whether it can still be restored.";
}

export function pendingDeletionDeadline(error: unknown): string | null {
  if (!error || typeof error !== "object") return null;
  const value = Reflect.get(error, "restorableUntil");
  return typeof value === "string" ? value : null;
}
