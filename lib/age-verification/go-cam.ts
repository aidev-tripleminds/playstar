import { apiFetch, ApiRequestError } from "@/lib/api/client";

import { GO_CAM_APPEARANCE, GO_CAM_LANGUAGES } from "./go-cam-appearance";

export type VerificationAttempt = {
  attemptId: string;
  verificationUrl: string;
  expiresAt: string;
};
export type VerificationStatus = "pending" | "verified" | "failed" | "expired";
type Result = "verified" | "cancelled";
const GO_CAM_ORIGIN = "https://go.cam";
// How long a closed overlay waits for the backend before it counts as a cancel.
const CLOSE_CHECK_MS = 8_000;
const GO_CAM_LANGUAGE_PATTERN = GO_CAM_LANGUAGES.join("|");
const GO_CAM_PATH = {
  iframe: new RegExp(`^/(${GO_CAM_LANGUAGE_PATTERN})/token/iframeCheck$`),
  redirect: new RegExp(`^/(${GO_CAM_LANGUAGE_PATTERN})/token/$`),
};
let active = false;

export class GoCamVerificationError extends Error {}

class GoCamTimeoutError extends GoCamVerificationError {}

export class GoCamUnavailableError extends GoCamVerificationError {
  constructor() {
    super("Age verification is currently unavailable. Please try again later.");
  }
}

export async function createVerificationAttempt(
  signal: AbortSignal,
  mode: "iframe" | "redirect" = "iframe",
): Promise<VerificationAttempt> {
  try {
    const attempt = await apiFetch<VerificationAttempt>("/api/v1/age-verification/attempts", {
      method: "POST",
      body: JSON.stringify({
        mode,
        origin: window.location.origin,
        returnPath: window.location.pathname + window.location.search + window.location.hash,
        appearance: GO_CAM_APPEARANCE,
      }),
      signal,
    });
    const url = new URL(attempt.verificationUrl);
    if (url.origin !== GO_CAM_ORIGIN || !GO_CAM_PATH[mode].test(url.pathname)) {
      throw new GoCamUnavailableError();
    }
    return attempt;
  } catch (error) {
    if (error instanceof ApiRequestError && error.status === 503) throw new GoCamUnavailableError();
    throw error;
  }
}

/** Navigate only after the backend has created and bound this attempt. */
export async function redirectAgeWithGoCam(
  signal: AbortSignal,
): Promise<"redirecting" | "cancelled"> {
  if (signal.aborted) return "cancelled";
  const attempt = await createVerificationAttempt(signal, "redirect");
  if (signal.aborted) return "cancelled";
  window.location.assign(attempt.verificationUrl);
  return "redirecting";
}

export function getVerificationStatus(attemptId: string, signal: AbortSignal) {
  return apiFetch<{ status: VerificationStatus; returnPath: string }>(
    `/api/v1/age-verification/status?attemptId=${encodeURIComponent(attemptId)}`,
    { signal, cache: "no-store" },
  );
}

export async function waitForVerification(
  attemptId: string,
  signal: AbortSignal,
  timeoutMs = 60_000,
): Promise<string> {
  const controller = new AbortController();
  const abort = () => controller.abort();
  const timeoutError = () =>
    new GoCamTimeoutError("Confirmation has not arrived from Go.cam. Please try again shortly.");
  if (signal.aborted) throw new DOMException("Cancelled", "AbortError");
  if (timeoutMs <= 0) throw timeoutError();
  signal.addEventListener("abort", abort, { once: true });
  const deadlineTimer = window.setTimeout(abort, timeoutMs);
  const pollingSignal = controller.signal;
  try {
    while (!pollingSignal.aborted) {
      const { status, returnPath } = await getVerificationStatus(attemptId, pollingSignal);
      if (pollingSignal.aborted) break;
      if (status === "verified") return returnPath;
      if (status === "failed")
        throw new GoCamVerificationError("Age verification failed. Please try again.");
      if (status === "expired")
        throw new GoCamVerificationError("Age verification expired. Please try again.");
      await new Promise<void>((resolve) => {
        const done = () => {
          clearTimeout(timer);
          pollingSignal.removeEventListener("abort", done);
          resolve();
        };
        const timer = window.setTimeout(done, 1500);
        pollingSignal.addEventListener("abort", done, { once: true });
      });
    }
    throw timeoutError();
  } catch (error) {
    if (signal.aborted) throw new DOMException("Cancelled", "AbortError");
    if (pollingSignal.aborted) throw timeoutError();
    throw error;
  } finally {
    clearTimeout(deadlineTimer);
    signal.removeEventListener("abort", abort);
  }
}

/**
 * Lifecycle protocol adapted from iframeSdkV1.zip/avsJsSdkV1.js. Keep origin AND
 * frame-source checks, detach listeners on teardown, and never trust a browser
 * success event as proof: the backend validates signed results or callbacks.
 */
export async function verifyAgeWithGoCam({
  signal,
  onOverlayOpen,
}: {
  signal: AbortSignal;
  onOverlayOpen: () => void;
}): Promise<Result> {
  if (signal.aborted) return "cancelled";
  if (active) throw new Error("Age verification is already in progress");
  active = true;
  try {
    const attempt = await createVerificationAttempt(signal);
    if (signal.aborted) return "cancelled";
    return await openVerificationOverlay(attempt, signal, onOverlayOpen);
  } finally {
    active = false;
  }
}

function openVerificationOverlay(
  attempt: VerificationAttempt,
  signal: AbortSignal,
  onOverlayOpen: () => void,
): Promise<Result> {
  return new Promise((resolve, reject) => {
    const controller = new AbortController();
    const frame = document.createElement("iframe");
    frame.title = "Go.cam age verification";
    frame.allow = `camera ${GO_CAM_ORIGIN}; microphone ${GO_CAM_ORIGIN}; publickey-credentials-get ${GO_CAM_ORIGIN}; publickey-credentials-create ${GO_CAM_ORIGIN}`;
    frame.referrerPolicy = "no-referrer";
    Object.assign(frame.style, {
      position: "fixed",
      inset: "0",
      width: "1px",
      height: "1px",
      border: "0",
      zIndex: "9999",
    });
    const confirming = document.createElement("div");
    confirming.setAttribute("role", "status");
    confirming.textContent = "Confirming age verification…";
    Object.assign(confirming.style, {
      position: "fixed",
      inset: "0",
      zIndex: "9999",
      display: "grid",
      placeItems: "center",
      background: GO_CAM_APPEARANCE.colors.bodyBackground,
      color: GO_CAM_APPEARANCE.colors.bodyForeground,
    });
    const cancel = document.createElement("button");
    cancel.type = "button";
    cancel.textContent = "Cancel verification";
    cancel.setAttribute("aria-label", "Cancel age verification");
    Object.assign(cancel.style, {
      position: "fixed",
      top: "12px",
      right: "12px",
      zIndex: "10000",
      padding: "8px 12px",
      borderRadius: "8px",
      background: GO_CAM_APPEARANCE.colors.buttonBackground,
      color: GO_CAM_APPEARANCE.colors.buttonForeground,
      cursor: "pointer",
    });
    const previousFocus =
      document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const previousOverflow = document.body.style.overflow;
    let settled = false;
    let submitted = false;
    let closeCheck: AbortController | null = null;
    const expiryTimer = window.setTimeout(
      () => finish(new Error("Age verification expired. Please try again.")),
      Math.max(0, Math.min(Date.parse(attempt.expiresAt) - Date.now(), 15 * 60_000)),
    );
    const finish = (result: Result | Error) => {
      if (settled) return;
      settled = true;
      controller.abort();
      clearTimeout(loadingTimer);
      clearTimeout(expiryTimer);
      signal.removeEventListener("abort", abort);
      window.removeEventListener("message", onMessage);
      window.removeEventListener("keydown", onKeyDown);
      frame.remove();
      cancel.remove();
      confirming.remove();
      document.body.style.overflow = previousOverflow;
      previousFocus?.focus();
      if (result instanceof Error) reject(result);
      else resolve(result);
    };
    const abort = () => finish("cancelled");
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") abort();
    };
    const emit = (name: string) =>
      frame.contentWindow?.postMessage({ name, data: {} }, GO_CAM_ORIGIN);
    const showConfirming = () => {
      clearTimeout(loadingTimer);
      if (!confirming.isConnected) document.body.append(confirming);
      cancel.focus();
    };
    const confirm = (payload: unknown) => {
      if (submitted) return;
      submitted = true;
      closeCheck?.abort();
      frame.remove();
      showConfirming();
      const receive = async () => {
        if (typeof payload === "string" && payload.length > 0) {
          try {
            await apiFetch("/api/v1/age-verification/result", {
              method: "POST",
              body: JSON.stringify({
                attemptId: attempt.attemptId,
                verificationResultPayload: payload,
              }),
              signal: controller.signal,
            });
          } catch {
            throw new GoCamVerificationError(
              "The Go.cam result could not be confirmed. Please try again.",
            );
          }
        }
        await waitForVerification(attempt.attemptId, controller.signal);
      };
      void receive().then(
        () => finish("verified"),
        (error: unknown) => {
          if (!settled) finish(error instanceof Error ? error : new Error("Verification failed"));
        },
      );
    };
    // Go.cam's sample only collapses the frame on close; it keeps running. Declining
    // the optional passkey save closes it after the age check may already have
    // passed, so keep listening for the signed result and ask the backend before
    // treating the close as a cancel.
    const onClose = () => {
      if (submitted || closeCheck) return;
      const check = new AbortController();
      closeCheck = check;
      controller.signal.addEventListener("abort", () => check.abort(), { once: true });
      Object.assign(frame.style, { width: "1px", height: "1px" });
      showConfirming();
      waitForVerification(attempt.attemptId, check.signal, CLOSE_CHECK_MS).then(
        () => finish("verified"),
        (error: unknown) => {
          if (check.signal.aborted) return;
          if (error instanceof GoCamTimeoutError) finish("cancelled");
          else finish(error instanceof Error ? error : new Error("Verification failed"));
        },
      );
    };
    const onMessage = (event: MessageEvent) => {
      if (event.origin !== GO_CAM_ORIGIN || event.source !== frame.contentWindow) return;
      if (!event.data || typeof event.data !== "object") return;
      switch (event.data.name) {
        case "avs.onCheckIframeLoaded":
          emit("avs.statusRequest");
          break;
        case "avs.onInitialVerificationNotFound":
          emit("avs.resourcePreload");
          break;
        case "avs.onInitialVerificationSuccess":
          // An old Go.cam device cookie alone cannot authorize a new attempt.
          // Run the verification phase so the provider can send its callback.
          emit("avs.resourcePreload");
          break;
        case "avs.onResourcesLoaded":
          clearTimeout(loadingTimer);
          frame.style.width = "100%";
          frame.style.height = "100%";
          frame.focus();
          break;
        case "avs.onVerificationSuccess":
          confirm(event.data.data?.payload);
          break;
        case "avs.onCloseIframe":
          onClose();
          break;
        case "avs.onVerificationError":
        case "avs.onInitialVerificationFatalError":
          finish(new Error("Go.cam verification failed. Please try again."));
          break;
      }
    };
    const loadingTimer = window.setTimeout(() => finish(new GoCamUnavailableError()), 30_000);
    signal.addEventListener("abort", abort, { once: true });
    window.addEventListener("message", onMessage);
    window.addEventListener("keydown", onKeyDown);
    frame.onload = () => emit("avs.statusRequest");
    frame.onerror = () => finish(new GoCamUnavailableError());
    cancel.onclick = abort;
    frame.src = attempt.verificationUrl;
    document.body.append(frame, cancel);
    document.body.style.overflow = "hidden";
    onOverlayOpen();
    cancel.focus();
  });
}
