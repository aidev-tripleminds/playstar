export const EMAIL_PREFERENCE_TITLE = "Confirm your email";
export const EMAIL_PREFERENCE_TITLE_ICON_SRC = "/assets/unread-mail.svg";
export const EMAIL_PREFERENCE_DESCRIPTION =
  "You can change these preferences at any time in your profile.";
export const EMAIL_PREFERENCE_ALLOW_LABEL = "Allow emails";
export const EMAIL_PREFERENCE_SAVE_LABEL = "Save";
export const EMAIL_PREFERENCE_LATER_LABEL = "Later";
export const EMAIL_PREFERENCE_CLOSE_LABEL = "Close";

export type EmailPreferenceOptionId = "marketing" | "product";

export type EmailPreferenceOption = {
  id: EmailPreferenceOptionId;
  title: string;
  description: string;
};

/**
 * Same two categories Settings > Notifications already persists
 * (`marketing_notifications` / `product_notifications`). Ids are the API
 * field stems, not the marketing copy — "Product updates" is `marketing`.
 */
export const EMAIL_PREFERENCE_OPTIONS: EmailPreferenceOption[] = [
  {
    id: "marketing",
    title: "Product updates and new features",
    description: "New releases, product features and overall news",
  },
  {
    id: "product",
    title: "Free tokens and special offers",
    description: "When we give away free tokens, discounts and deals.",
  },
];

export type EmailPreferenceValues = Record<EmailPreferenceOptionId, boolean>;

export const EMAIL_PREFERENCE_DEFAULT_VALUES: EmailPreferenceValues = {
  marketing: true,
  product: true,
};

export function selectedEmailPreferenceCount(values: EmailPreferenceValues): number {
  return EMAIL_PREFERENCE_OPTIONS.filter((option) => values[option.id]).length;
}

export function emailPreferenceCountLabel(
  selected: number,
  total = EMAIL_PREFERENCE_OPTIONS.length,
) {
  return `${selected} of ${total} selected`;
}
