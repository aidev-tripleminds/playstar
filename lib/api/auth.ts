import { apiFetch } from "./client";

/** Every auth compat route answers with a single human-readable message. */
type AuthMessageResponse = { message: string };

/**
 * Ask the backend to email a reset link.
 *
 * Answers 200 whether or not the address has an account (anti-enumeration), so
 * callers must not treat a resolved promise as "this email exists".
 */
export function requestPasswordReset(email: string): Promise<AuthMessageResponse> {
  return apiFetch<AuthMessageResponse>("/api/v1/auth/password-reset/request", {
    method: "POST",
    body: JSON.stringify({ email }),
  });
}

/**
 * Redeem a reset token from the emailed link and set the new password.
 * Rejects with a 400 `ApiRequestError` when the token is invalid, already used,
 * or expired.
 */
export function confirmPasswordReset(
  token: string,
  newPassword: string,
): Promise<AuthMessageResponse> {
  return apiFetch<AuthMessageResponse>("/api/v1/auth/password-reset/confirm", {
    method: "POST",
    body: JSON.stringify({ token, new_password: newPassword }),
  });
}
