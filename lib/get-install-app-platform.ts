import { UAParser } from "ua-parser-js";

export type InstallAppPlatform = "ios" | "android";

export type GetInstallAppPlatformInput = {
  /** Explicit UA string (SSR, middleware, tests). Defaults to `navigator.userAgent`. */
  userAgent?: string;
  /**
   * Touch capacity used to catch iPadOS “desktop website” UAs that report as Mac.
   * Defaults to `navigator.maxTouchPoints`.
   */
  maxTouchPoints?: number;
  /** Returned when no UA is available (e.g. SSR without headers). @default "android" */
  fallback?: InstallAppPlatform;
};

const DEFAULT_FALLBACK: InstallAppPlatform = "android";

/** iPadOS 13+ desktop Safari reports as Macintosh; multi-touch distinguishes real Macs. */
const IPAD_DESKTOP_MIN_TOUCH_POINTS = 2;

function normalizeInput(input?: string | GetInstallAppPlatformInput): GetInstallAppPlatformInput {
  if (typeof input === "string") {
    return { userAgent: input };
  }

  return input ?? {};
}

function resolveUserAgent(userAgent?: string): string | undefined {
  if (typeof userAgent === "string" && userAgent.length > 0) {
    return userAgent;
  }

  if (typeof navigator !== "undefined" && typeof navigator.userAgent === "string") {
    return navigator.userAgent || undefined;
  }

  return undefined;
}

function resolveMaxTouchPoints(maxTouchPoints?: number): number {
  if (typeof maxTouchPoints === "number" && Number.isFinite(maxTouchPoints)) {
    return maxTouchPoints;
  }

  if (typeof navigator !== "undefined" && typeof navigator.maxTouchPoints === "number") {
    return navigator.maxTouchPoints;
  }

  return 0;
}

function isAppleMobileOs(osName: string): boolean {
  return osName.includes("ios") || osName.includes("ipad");
}

function isAppleMobileDevice(deviceModel: string): boolean {
  return (
    deviceModel.includes("iphone") || deviceModel.includes("ipad") || deviceModel.includes("ipod")
  );
}

function isIpadDesktopUserAgent(
  osName: string,
  deviceModel: string,
  maxTouchPoints: number,
): boolean {
  const isMacLike = osName.includes("mac") || deviceModel === "macintosh";
  return isMacLike && maxTouchPoints > IPAD_DESKTOP_MIN_TOUCH_POINTS;
}

/**
 * Resolves which install-app experience to show (`ios` | `android`).
 *
 * - Pure & testable: pass `userAgent` / `maxTouchPoints` explicitly.
 * - SSR-safe: returns `fallback` when no UA is available.
 * - Handles iPadOS desktop-mode UAs that spoof Macintosh.
 *
 * @example
 * getInstallAppPlatform()
 * getInstallAppPlatform(request.headers.get("user-agent") ?? undefined)
 * getInstallAppPlatform({ userAgent, maxTouchPoints: 5 })
 */
export function getInstallAppPlatform(
  input?: string | GetInstallAppPlatformInput,
): InstallAppPlatform {
  const { userAgent, maxTouchPoints, fallback = DEFAULT_FALLBACK } = normalizeInput(input);
  const ua = resolveUserAgent(userAgent);

  if (!ua) {
    return fallback;
  }

  const parser = new UAParser(ua);
  const osName = parser.getOS().name?.toLowerCase() ?? "";
  const deviceModel = parser.getDevice().model?.toLowerCase() ?? "";
  const touchPoints = resolveMaxTouchPoints(maxTouchPoints);

  if (
    isAppleMobileOs(osName) ||
    isAppleMobileDevice(deviceModel) ||
    isIpadDesktopUserAgent(osName, deviceModel, touchPoints)
  ) {
    return "ios";
  }

  return "android";
}
