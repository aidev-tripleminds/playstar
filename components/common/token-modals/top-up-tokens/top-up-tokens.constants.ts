export type TopUpTokensStep = {
  tokens: number;
  priceLabel: string;
};

/** Figma 21676:96648 — four discrete slider stops at 0% / 33% / 66% / 100%. */
export const TOP_UP_TOKENS_STEPS: readonly TopUpTokensStep[] = [
  { tokens: 0, priceLabel: "€0.00" },
  { tokens: 600, priceLabel: "€29.99" },
  { tokens: 1400, priceLabel: "€69.99" },
  { tokens: 3000, priceLabel: "€149.99" },
] as const;

export const TOP_UP_TOKENS_STEP_MIN = 0;
export const TOP_UP_TOKENS_STEP_MAX = TOP_UP_TOKENS_STEPS.length - 1;
export const TOP_UP_TOKENS_STEP_SIZE = 1;

/** Default matches Figma preview (600 tokens / second stop). */
export const TOP_UP_TOKENS_DEFAULT_STEP_INDEX = 1;

export const TOP_UP_TOKENS_TITLE = "Add extra tokens to your order";
export const TOP_UP_TOKENS_ICON_SRC = "/assets/spice-coin.png";
export const TOP_UP_TOKENS_ICON_ALT = "Spice coin";

export function formatTopUpTokenAmount(tokens: number): string {
  return tokens.toLocaleString("en-US");
}

export function formatTopUpTokensLabel(tokens: number): string {
  return `${formatTopUpTokenAmount(tokens)} Tokens`;
}
