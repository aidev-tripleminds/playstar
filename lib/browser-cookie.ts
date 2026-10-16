/**
 * document.cookie helpers for the consent gates.
 *
 * These cookies drive the UI gates only. They are host-only and SameSite=Lax on
 * the app origin, so they are NOT sent to the API (which lives on a different
 * origin) — the durable proof of consent is recorded server-side against the
 * backend's own visitor session, not read off these. There's no native change
 * event for cookies, so same-tab subscribers are notified via a CustomEvent, and
 * cross-tab subscribers via a localStorage "ping" key (which does fire the
 * native `storage` event across tabs) — the cookie itself stays the source
 * of truth, the ping just tells other tabs to re-read it.
 */

export const ONE_YEAR_SECONDS = 60 * 60 * 24 * 365;

const COOKIE_CHANGE_EVENT = "spicestars:cookie-change";
const COOKIE_SYNC_STORAGE_PREFIX = "spicestars:cookie-sync:";

type CookieChangeDetail = {
  name: string;
};

function isBrowser() {
  return typeof window !== "undefined" && typeof document !== "undefined";
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function readCookie(name: string): string | null {
  if (!isBrowser()) {
    return null;
  }

  try {
    const match = document.cookie.match(new RegExp(`(?:^|; )${escapeRegExp(name)}=([^;]*)`));
    return match ? decodeURIComponent(match[1]) : null;
  } catch {
    return null;
  }
}

export function writeCookie(name: string, value: string, maxAgeSeconds: number): void {
  if (!isBrowser()) {
    return;
  }

  try {
    const secure = window.location.protocol === "https:" ? "; Secure" : "";
    document.cookie = `${name}=${encodeURIComponent(value)}; max-age=${maxAgeSeconds}; path=/; SameSite=Lax${secure}`;
  } catch {
    return;
  }

  window.dispatchEvent(
    new CustomEvent<CookieChangeDetail>(COOKIE_CHANGE_EVENT, { detail: { name } }),
  );

  try {
    localStorage.setItem(`${COOKIE_SYNC_STORAGE_PREFIX}${name}`, String(Date.now()));
  } catch {
    // Ignore storage failures (private mode, quota, etc.) — same-tab sync still works.
  }
}

export function subscribeToCookieKey(name: string, onStoreChange: () => void): () => void {
  if (!isBrowser()) {
    return () => {};
  }

  const handleChange = (event: Event) => {
    const detail = (event as CustomEvent<CookieChangeDetail>).detail;
    if (detail?.name === name) {
      onStoreChange();
    }
  };

  const handleStorage = (event: StorageEvent) => {
    if (event.key === `${COOKIE_SYNC_STORAGE_PREFIX}${name}`) {
      onStoreChange();
    }
  };

  window.addEventListener(COOKIE_CHANGE_EVENT, handleChange);
  window.addEventListener("storage", handleStorage);
  return () => {
    window.removeEventListener(COOKIE_CHANGE_EVENT, handleChange);
    window.removeEventListener("storage", handleStorage);
  };
}
