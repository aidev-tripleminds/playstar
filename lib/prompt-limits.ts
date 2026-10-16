/**
 * Backend `PROMPT_MAX_LENGTH` (`src/lib/prompt-limits.ts`). One cap for every
 * user-typed prompt. The field counts every character; the API counts the
 * trimmed text (FRONT-899).
 */
export const PROMPT_MAX_LENGTH = 2500;

/** What the textarea holds. Spaces count, matching `maxLength`. */
export function capUserPrompt(value: string): string {
  return value.length <= PROMPT_MAX_LENGTH ? value : value.slice(0, PROMPT_MAX_LENGTH);
}

/** What is submitted. The backend measures length after trim. */
export function capTrimmedUserPrompt(value: string | undefined | null): string {
  const trimmed = value?.trim() ?? "";
  return trimmed.length <= PROMPT_MAX_LENGTH ? trimmed : trimmed.slice(0, PROMPT_MAX_LENGTH);
}
