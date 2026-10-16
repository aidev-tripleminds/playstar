/**
 * HTTP Basic auth gate, applied in every environment.
 *
 * The gate is on only while `PREVIEW_PASSWORD` exists in the environment;
 * while that variable is unset the deployment stays open, so forgetting to
 * configure it cannot lock anyone out. Scope the variable in Vercel to choose
 * where the gate applies — production is gated too when it is set there.
 *
 * Set the password:  vercel env add PREVIEW_PASSWORD
 * The username defaults to "preview" and `PREVIEW_USERNAME` overrides it.
 *
 * The decision lives here rather than in `proxy.ts` so it can be unit tested;
 * `proxy.ts` only turns the decision into a response.
 */

export const PREVIEW_AUTH_REALM = "SpiceStars preview";

const DEFAULT_PREVIEW_USERNAME = "preview";

export type PreviewAuthConfig = {
  username?: string;
  password?: string;
};

/** "allow" lets the request through; "challenge" answers with a 401. */
export type PreviewAuthDecision = "allow" | "challenge";

function decodeBase64(value: string) {
  try {
    return Buffer.from(value, "base64").toString("utf8");
  } catch {
    return null;
  }
}

export function evaluatePreviewAuth(
  authorizationHeader: string | null,
  config: PreviewAuthConfig,
): PreviewAuthDecision {
  const { password } = config;

  // The gate is off everywhere until a password exists.
  if (!password) {
    return "allow";
  }

  const username = config.username || DEFAULT_PREVIEW_USERNAME;
  const [scheme, encoded] = (authorizationHeader || "").split(" ");

  // RFC 7235 says the scheme is case-insensitive.
  if (scheme?.toLowerCase() !== "basic" || !encoded) {
    return "challenge";
  }

  const decoded = decodeBase64(encoded);
  if (decoded === null) {
    return "challenge";
  }

  // Split on the first colon only — a password may contain colons, a username may not.
  const separator = decoded.indexOf(":");
  if (separator === -1) {
    return "challenge";
  }

  if (decoded.slice(0, separator) !== username || decoded.slice(separator + 1) !== password) {
    return "challenge";
  }

  return "allow";
}
