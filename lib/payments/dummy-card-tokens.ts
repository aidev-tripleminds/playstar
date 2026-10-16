/**
 * Dummy-provider-only card mapping. Delete this module whole when a real
 * payment provider ships; its SDK must own card collection instead.
 */
const TEST_CARD_TOKENS: Record<string, string> = {
  "4242424242424242": "dummy_success",
  "4000000000000002": "dummy_card_declined",
  "4000000000000069": "dummy_expired_card",
  "4000000000000119": "dummy_processing_error",
  "4999999999999999": "dummy_outcome_unknown",
};

export function dummyTokenForCardNumber(cardNumber: string): string {
  const digits = cardNumber.replace(/\D/g, "");
  return TEST_CARD_TOKENS[digits] ?? digits;
}
