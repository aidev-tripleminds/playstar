"use client";

import * as React from "react";

import {
  dismissModalHistoryEntry,
  isModalHistoryEntryPopped,
  pushModalHistoryEntry,
} from "@/lib/modal-history";

type UseModalHistoryBackOptions = {
  /** Whether the modal is currently open. */
  open: boolean;
  /** Close the modal when the browser back button pops this entry. */
  onClose: () => void;
  /** Set false to opt out (e.g. non-dismissible system dialogs). Default true. */
  enabled?: boolean;
  /**
   * Optional Back interceptor. Return `false` to keep the dialog open and
   * re-push the synthetic history entry (e.g. leave-retention Skip-on-Back).
   * Return `true` / void to allow the normal close path.
   */
  onHistoryBack?: () => boolean | void;
};

type PendingRelease = {
  cancel: () => void;
};

type UseModalHistoryBackResult = {
  /**
   * Drop the synthetic history entry in the current turn (close click / overlay).
   * Android Chrome otherwise defers `history.back()` until the next tap, which
   * immediately closes the modal that tap just opened.
   */
  release: () => void;
};

/**
 * Survives React Strict Mode remounts so we don't push/pop history twice for one open.
 * Keyed by `useId()` which is stable across the strict remount pair.
 */
const pendingReleases = new Map<string, PendingRelease>();
const liveEntries = new Set<string>();

/**
 * Traps the browser Back button while a modal is open:
 * - Back closes the modal and stays on the current page
 * - Normal close (X / Esc / overlay) removes the synthetic history entry
 * - Nested modals stack LIFO (inner closes first)
 * - Strict Mode safe (deferred dismiss; remount cancels the pending pop)
 * - Optional `onHistoryBack` can consume Back without closing (re-traps history)
 */
export function useModalHistoryBack({
  open,
  onClose,
  enabled = true,
  onHistoryBack,
}: UseModalHistoryBackOptions): UseModalHistoryBackResult {
  const modalId = React.useId();
  const onCloseRef = React.useRef(onClose);
  const onHistoryBackRef = React.useRef(onHistoryBack);
  const isActiveRef = React.useRef(false);

  React.useLayoutEffect(() => {
    onCloseRef.current = onClose;
    onHistoryBackRef.current = onHistoryBack;
  });

  const release = React.useCallback(() => {
    if (!isActiveRef.current) {
      return;
    }

    isActiveRef.current = false;
    liveEntries.delete(modalId);
    const pending = pendingReleases.get(modalId);
    if (pending) {
      pending.cancel();
      pendingReleases.delete(modalId);
    }
    dismissModalHistoryEntry(modalId);
  }, [modalId]);

  React.useEffect(() => {
    if (!enabled || !open || typeof window === "undefined") {
      return;
    }

    const pending = pendingReleases.get(modalId);
    if (pending) {
      // Strict Mode remount: keep the existing history entry.
      pending.cancel();
      pendingReleases.delete(modalId);
    } else if (!liveEntries.has(modalId)) {
      pushModalHistoryEntry(modalId);
    }

    liveEntries.add(modalId);
    isActiveRef.current = true;

    const handlePopState = () => {
      if (!isActiveRef.current) {
        return;
      }

      // Nested modal above us was closed — our entry is still in the stack.
      if (!isModalHistoryEntryPopped(modalId)) {
        return;
      }

      // Interceptor may advance internal UI (e.g. retention Skip) and keep the
      // modal open. Re-push so the next Back is trapped again.
      if (onHistoryBackRef.current?.() === false) {
        pushModalHistoryEntry(modalId);
        return;
      }

      isActiveRef.current = false;
      liveEntries.delete(modalId);
      onCloseRef.current();
    };

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);

      // Browser back already cleared this entry and called onClose.
      // `release()` already dismissed during the close gesture.
      if (!isActiveRef.current) {
        return;
      }

      isActiveRef.current = false;

      // Defer dismiss so Strict Mode remount can cancel before we touch history.
      let cancelled = false;
      const cancel = () => {
        cancelled = true;
      };
      pendingReleases.set(modalId, { cancel });

      queueMicrotask(() => {
        pendingReleases.delete(modalId);
        if (cancelled) {
          return;
        }

        liveEntries.delete(modalId);
        dismissModalHistoryEntry(modalId);
      });
    };
  }, [enabled, open, modalId]);

  return { release };
}
