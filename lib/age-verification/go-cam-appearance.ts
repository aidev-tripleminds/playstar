/**
 * How go.cam's verification page looks. The backend validates these values and
 * signs them into the go.cam URL (see POST /api/v1/age-verification/attempts):
 * colors must be 6-digit hex, and unknown keys are rejected with HTTP 400.
 * Which verification methods go.cam offers is set in the backend (admin
 * App Config, AgeVerification section), not here.
 */
export const GO_CAM_LANGUAGES = ["en", "fr", "de", "nl", "it", "pt", "es"] as const;

export type GoCamAppearance = {
  language?: (typeof GO_CAM_LANGUAGES)[number];
  colors?: {
    bodyBackground: string;
    bodyForeground: string;
    buttonBackground: string;
    buttonForeground: string;
    buttonForegroundCallToAction: string;
    buttonBackgroundFailure: string;
    buttonForegroundFailure: string;
    buttonForegroundCallToActionFailure: string;
  };
};

// SpiceStars palette, mirrored from app/globals.css tokens.
export const GO_CAM_APPEARANCE = {
  language: "en",
  colors: {
    bodyBackground: "#0e0e0e", // --dialog-bg, same as the verify-age modal
    bodyForeground: "#fafafa", // --foreground
    buttonBackground: "#e60076", // --brand-primary
    buttonForeground: "#ffffff",
    buttonForegroundCallToAction: "#ffffff",
    buttonBackgroundFailure: "#e11d48", // --state-error-border
    buttonForegroundFailure: "#ffffff",
    buttonForegroundCallToActionFailure: "#ffffff",
  },
} satisfies GoCamAppearance;
