export type IsInstalledAppInput = {
  /** Override `window.matchMedia` (tests). */
  matchMedia?: (query: string) => Pick<MediaQueryList, "matches">;
  /** Override iOS `navigator.standalone` (tests). */
  standalone?: boolean;
};

/**
 * True when the page is running as an installed app (PWA / “Add to Home Screen”).
 */
export function isInstalledApp(input?: IsInstalledAppInput): boolean {
  const matchMedia =
    input?.matchMedia ??
    (typeof window !== "undefined" && typeof window.matchMedia === "function"
      ? (query: string) => window.matchMedia(query)
      : undefined);

  if (matchMedia?.("(display-mode: standalone)").matches) {
    return true;
  }

  if (typeof input?.standalone === "boolean") {
    return input.standalone;
  }

  if (typeof navigator !== "undefined") {
    return Boolean((navigator as Navigator & { standalone?: boolean }).standalone);
  }

  return false;
}
