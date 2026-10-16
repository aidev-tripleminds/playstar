/**
 * Same-tab + cross-tab localStorage helpers for consent gates.
 *
 * `storage` events only fire across tabs, so we also dispatch a CustomEvent
 * after writes in the current tab so `useSyncExternalStore` subscribers update.
 */

const STORAGE_CHANGE_EVENT = "spicestars:storage-change";

type StorageChangeDetail = {
  key: string;
};

function isBrowser() {
  return typeof window !== "undefined";
}

export function readBrowserStorage(key: string): string | null {
  if (!isBrowser()) {
    return null;
  }

  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

export function writeBrowserStorage(key: string, value: string): void {
  if (!isBrowser()) {
    return;
  }

  try {
    localStorage.setItem(key, value);
  } catch {
    // Ignore storage failures (private mode, quota, etc.)
  }

  window.dispatchEvent(
    new CustomEvent<StorageChangeDetail>(STORAGE_CHANGE_EVENT, { detail: { key } }),
  );
}

export function subscribeToBrowserStorageKey(key: string, onStoreChange: () => void): () => void {
  if (!isBrowser()) {
    return () => {};
  }

  const handleStorage = (event: StorageEvent) => {
    if (event.key === key || event.key === null) {
      onStoreChange();
    }
  };

  const handleSameTab = (event: Event) => {
    const detail = (event as CustomEvent<StorageChangeDetail>).detail;
    if (detail?.key === key) {
      onStoreChange();
    }
  };

  window.addEventListener("storage", handleStorage);
  window.addEventListener(STORAGE_CHANGE_EVENT, handleSameTab);

  return () => {
    window.removeEventListener("storage", handleStorage);
    window.removeEventListener(STORAGE_CHANGE_EVENT, handleSameTab);
  };
}
