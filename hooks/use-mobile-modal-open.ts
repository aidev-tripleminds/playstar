"use client";

import * as React from "react";

/**
 * Dialog and drawer portals drop `data-slot`, so the open signal is the
 * overlay and content that actually mount (including the close animation).
 * The mobile bottom nav is also portaled to `document.body` at a higher
 * z-index, so this is the signal to take it out of the way. Media preview
 * uses a forced dialog, and the shell is included so the nav stays hidden
 * for the whole preview, not only while a nested sheet is open.
 */
const OPEN_MOBILE_MODAL_SELECTOR = [
  '[data-slot="dialog-portal"]',
  '[data-slot="drawer-portal"]',
  '[data-slot="alert-dialog-portal"]',
  '[data-slot="dialog-overlay"]',
  '[data-slot="drawer-overlay"]',
  '[data-slot="alert-dialog-overlay"]',
  '[data-slot="dialog-content"]',
  '[data-slot="drawer-content"]',
  '[data-slot="alert-dialog-content"]',
  '[data-slot="modal-layout"]',
  '[data-slot="media-preview-shell"]',
].join(",");

function subscribeToMobileModalOpen(onStoreChange: () => void) {
  const observer = new MutationObserver(onStoreChange);
  observer.observe(document.body, { childList: true, subtree: true });
  return () => observer.disconnect();
}

function getMobileModalOpenSnapshot() {
  return document.querySelector(OPEN_MOBILE_MODAL_SELECTOR) != null;
}

function getMobileModalOpenServerSnapshot() {
  return false;
}

export function useMobileModalOpen() {
  return React.useSyncExternalStore(
    subscribeToMobileModalOpen,
    getMobileModalOpenSnapshot,
    getMobileModalOpenServerSnapshot,
  );
}
