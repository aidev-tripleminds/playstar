import { readBrowserStorage, writeBrowserStorage } from "@/lib/browser-storage";

import {
  EARN_FREE_TOKENS_PENDING_STORAGE_KEY,
  EARN_FREE_TOKENS_REDEEMED_STORAGE_KEY,
  EARN_FREE_TOKENS_STORAGE_FLAG,
} from "./earn-free-tokens.constants";

export function isEarnFreeTokensPending(): boolean {
  return readBrowserStorage(EARN_FREE_TOKENS_PENDING_STORAGE_KEY) === EARN_FREE_TOKENS_STORAGE_FLAG;
}

export function markEarnFreeTokensPending(): void {
  writeBrowserStorage(EARN_FREE_TOKENS_PENDING_STORAGE_KEY, EARN_FREE_TOKENS_STORAGE_FLAG);
}

export function isEarnFreeTokensRedeemed(): boolean {
  return (
    readBrowserStorage(EARN_FREE_TOKENS_REDEEMED_STORAGE_KEY) === EARN_FREE_TOKENS_STORAGE_FLAG
  );
}

export function markEarnFreeTokensRedeemed(): void {
  writeBrowserStorage(EARN_FREE_TOKENS_REDEEMED_STORAGE_KEY, EARN_FREE_TOKENS_STORAGE_FLAG);
  writeBrowserStorage(EARN_FREE_TOKENS_PENDING_STORAGE_KEY, "0");
}
