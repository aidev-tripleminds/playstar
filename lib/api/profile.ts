import { apiFetch } from "./client";
import type { UserProfileResponse } from "./types";

/** Read the logged-in user's profile (username, gender, avatar, …). */
export function fetchProfile(): Promise<UserProfileResponse> {
  return apiFetch<UserProfileResponse>("/api/v1/user/get-profile");
}

/**
 * Fields accepted by `POST /api/v1/user/add-update-profile` (multipart).
 * `username` is unique per Organization and mandatory — every account is
 * assigned one automatically at signup and may amend it here. A collision
 * with another user in the same Organization returns 409.
 */
export type UpdateProfileInput = {
  username?: string;
  gender?: string;
  full_name?: string;
  /** YYYY-MM-DD */
  birth_date?: string;
  marketing_notifications?: boolean;
  product_notifications?: boolean;
};

export type EmailPreferencesInput = Required<
  Pick<UpdateProfileInput, "marketing_notifications" | "product_notifications">
>;

/** Create or update the logged-in user's profile (UserProfile 1:1 row). */
export function updateProfile(input: UpdateProfileInput): Promise<unknown> {
  const formData = new FormData();
  for (const [key, value] of Object.entries(input)) {
    if (value !== undefined) {
      formData.append(key, String(value));
    }
  }

  return apiFetch("/api/v1/user/add-update-profile", {
    method: "POST",
    body: formData,
  });
}

/** Save the email preferences selected during signup or from settings. */
export function updateEmailPreferences(input: EmailPreferencesInput): Promise<unknown> {
  return apiFetch("/api/v1/user/email-preferences", {
    method: "PUT",
    body: JSON.stringify(input),
  });
}
