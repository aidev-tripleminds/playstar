/** Figma 10394:381236 — 1440px Pay Empty (Monthly) subscription cart
 *  Figma 21786:87114 — 1440px Pay Empty (Monthly) subscription + tokens
 *  Figma 10394:381329 — 1440px Pay Empty (Tokens)
 *  Figma 10394:381481 — 1440px Loading Card Inputs
 *  Figma 10394:381545 — 1440px Pay - Processing
 *  Figma 10394:381733 — Payment successful
 *  Figma 10394:381637 — 1440px Failure
 *  Figma 20619:112519 — 1440px card attempts timeout
 *  Figma 10394:381421 — 1440px Remembered for you
 *  Figma 10394:380943 — Mobile Remembered for you
 *  Figma 10394:380707 — Mobile Pay Empty
 */

export const PAY_EMPTY_MONTHLY_ALERT_TEXT =
  "Lorem ipsum dolorem nevada litera victo eratum et geniase heretis octum citeas.";

export const PAY_EMPTY_MONTHLY_CARD_LABEL = "Card information";
export const PAY_EMPTY_MONTHLY_CARDHOLDER_LABEL = "Cardholder name";
export const PAY_EMPTY_MONTHLY_CARD_NUMBER_PLACEHOLDER = "1234 1234 1234 1234";
export const PAY_EMPTY_MONTHLY_EXPIRY_PLACEHOLDER = "MM / YY";
export const PAY_EMPTY_MONTHLY_CVC_PLACEHOLDER = "CVC";
export const PAY_EMPTY_MONTHLY_CARDHOLDER_PLACEHOLDER = "Full name on card";
export const PAY_EMPTY_MONTHLY_LOADING_FORM_TEXT = "Loading payment form…";
export const PAY_EMPTY_MONTHLY_PROCESSING_LABEL = "Processing...";
export const PAY_EMPTY_MONTHLY_SUCCESS_TITLE = "Payment successful!";
export const PAY_EMPTY_MONTHLY_SUCCESS_REDIRECT_MS = 3_000;
export const PAY_EMPTY_MONTHLY_SUCCESS_REDIRECT_SECONDS =
  PAY_EMPTY_MONTHLY_SUCCESS_REDIRECT_MS / 1000;

export function formatPayEmptyMonthlySuccessRedirectText(totalSeconds: number): string {
  return `Redirecting in ${totalSeconds}s`;
}

export const PAY_EMPTY_MONTHLY_SUCCESS_REDIRECT_TEXT = formatPayEmptyMonthlySuccessRedirectText(
  PAY_EMPTY_MONTHLY_SUCCESS_REDIRECT_SECONDS,
);
export const PAY_EMPTY_MONTHLY_SUCCESS_CTA = "Start creating";
export const PAY_EMPTY_MONTHLY_FAILURE_TITLE = "Your bank declined the payment. Please try again.";
export const PAY_EMPTY_MONTHLY_TIMEOUT_ALERT_TEXT =
  "Too many attempts. Card payments are temporary disabled. Try again in {time}.";
export const PAY_EMPTY_MONTHLY_TIMEOUT_MS = 5 * 60 * 1000;
export const PAY_EMPTY_MONTHLY_REMEMBERED_TITLE = "Remembered for you";
export const PAY_EMPTY_MONTHLY_REMEMBERED_SUBTITLE =
  "We’ve saved your last payment method to speed things up.";
export const PAY_EMPTY_MONTHLY_DIFFERENT_METHOD_CTA = "Use a different payment method";
export const PAY_EMPTY_MONTHLY_SAVED_CARDS = [
  { id: "visa-4242", brand: "Visa", ending: "4242" },
  { id: "visa-1881", brand: "Visa", ending: "1881" },
  { id: "visa-5512", brand: "Visa", ending: "5512" },
] as const;
export const PAY_EMPTY_MONTHLY_SAVED_CARD_DEFAULT_ID = "visa-1881";

export const PAY_EMPTY_MONTHLY_COMPANY_ADDRESS =
  "OMNIPINK LTD, HE 491125 John Kennendy 8, IRIS HOUSE, 3rd floor 3106, Limassol, Cyprus";
export const PAY_EMPTY_MONTHLY_POWERED_BY = "Powered by";

export const PAY_EMPTY_MONTHLY_TOTAL_DUE_LABEL = "Total due today";

export const PAY_EMPTY_MONTHLY_TOKENS = {
  title: "600 Extra Tokens",
  subtitle: "One-time payment",
  price: 2999,
  tokenAmount: "600",
  badge: "TOKENS",
} as const;

export const PAY_EMPTY_MONTHLY_TOKEN_PACK = {
  title: "1000 Tokens",
  subtitle: "One-time payment",
  price: 1999,
  originalPrice: 3999,
  discountLabel: "-50%",
  tokenAmount: "1000",
  badge: "TOKENS",
} as const;

export const PAY_EMPTY_MONTHLY_ASSETS = {
  applePayMark: "/assets/payment-gateway/apple-pay-mark.svg",
  googlePayMark: "/assets/payment-gateway/google-pay-mark.svg",
  ideal: "/assets/payment-gateway/ideal.svg",
  cardBrands: "/assets/payment-gateway/card-brands.svg",
  poweredBy: "/assets/payment-gateway/powered-by.svg",
  cardIcon: "/assets/solar_card.svg",
  alertIcon: "/assets/info-circle-filled.svg",
  warningIcon: "/assets/alert-icon.svg",
  visa: "/assets/visa.svg",
  cryptoMarks: [
    { src: "/assets/payment-gateway/crypto-btc.svg", width: 20, height: 20, zIndex: 2 },
    { src: "/assets/payment-gateway/crypto-eth.svg", width: 20, height: 20 },
    { src: "/assets/payment-gateway/crypto-usdt.svg", width: 20, height: 20 },
    { src: "/assets/payment-gateway/crypto-usdc.svg", width: 20, height: 20 },
  ],
} as const;
