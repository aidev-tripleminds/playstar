/**
 * The single source of truth for password length limits and the user-facing
 * copy that goes with them. Every surface that accepts a password (signup, the
 * reset-link change-password modal) validates through here, so raising or
 * lowering the bounds is a one-line change rather than a hunt across modals.
 *
 *
 * Deliberately length-only: no digit/symbol/case requirements. Composition
 * rules push users toward predictable substitutions without buying real
 * strength, so the product decided against them.
 */

export const PASSWORD_MIN_LENGTH = 8;
export const PASSWORD_MAX_LENGTH = 128;

/**
 * Error copy, verbatim from the design's error-message inventory. Shared so the
 * same wording appears whether the password was rejected at signup or at reset.
 */
export const PASSWORD_ERROR_MESSAGES = {
  required: "Required fields missing",
  tooShort: "Password is too short",
  tooLong: "Password is too long",
  mismatch: "Passwords do not match",
} as const;

/** Checklist copy shown live under the new-password field. */
export const PASSWORD_RULE_LABELS = {
  minLength: `${PASSWORD_MIN_LENGTH} characters`,
  maxLength: `${PASSWORD_MAX_LENGTH} characters max`,
} as const;

export function isPasswordLongEnough(password: string): boolean {
  return password.length >= PASSWORD_MIN_LENGTH;
}

export function isPasswordShortEnough(password: string): boolean {
  return password.length <= PASSWORD_MAX_LENGTH;
}

/**
 * Validate a password against the length policy.
 *
 * @returns the error message to display, or `null` when the password is fine.
 */
export function validatePassword(password: string): string | null {
  if (!password) return PASSWORD_ERROR_MESSAGES.required;
  if (!isPasswordLongEnough(password)) return PASSWORD_ERROR_MESSAGES.tooShort;
  if (!isPasswordShortEnough(password)) return PASSWORD_ERROR_MESSAGES.tooLong;
  return null;
}
