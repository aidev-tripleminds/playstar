"use client";

import Image from "next/image";
import Link from "next/link";
import * as React from "react";

import { AGE_WARNING_COOKIE_NAME } from "@/components/common/general/age-warning/age-warning";
import {
  COOKIE_CONSENT_STORAGE_KEY,
  hasCookieConsent,
} from "@/components/common/general/cookie-popup/cookie-popup";
import { ModalLayout } from "@/components/common/general/modal-layout/modal-layout";
import { DialogDescription } from "@/components/ui/dialog";
import { readCookie, subscribeToCookieKey } from "@/lib/browser-cookie";
import { subscribeToBrowserStorageKey } from "@/lib/browser-storage";
import { cn } from "@/lib/utils";

import {
  LATEST_NEWS_CLOSE_CLASS,
  LATEST_NEWS_CLOSE_LABEL,
  LATEST_NEWS_ITEMS,
  LATEST_NEWS_LIST_CLASS,
  LATEST_NEWS_MODAL_CLASS,
  LATEST_NEWS_READ_MORE_LABEL,
  LATEST_NEWS_SEEN_STORAGE_KEY,
  LATEST_NEWS_TITLE,
  LATEST_NEWS_TITLE_ICON_SRC,
  type LatestNewsItem,
} from "./latest-news-popup.constants";
import { getUnseenNewsItems, markNewsItemsSeen } from "./latest-news-seen";

export type LatestNewsPopupProps = {
  trigger?: React.ReactNode;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  items?: readonly LatestNewsItem[];
  /**
   * When true (default), opens after age + cookie gates if there is unseen
   * important news. Closing stores the ids so it stays hidden until a new
   * important item is published.
   */
  autoOpen?: boolean;
  title?: string;
  titleIconSrc?: string;
  onClose?: () => void;
  className?: string;
};

function hasAcknowledgedAge(cookieName = AGE_WARNING_COOKIE_NAME) {
  const raw = readCookie(cookieName);
  return raw != null && !Number.isNaN(Date.parse(raw));
}

function hasCompletedConsent() {
  return hasAcknowledgedAge() && hasCookieConsent();
}

function newsBodyParagraphs(body: LatestNewsItem["body"]): readonly string[] {
  return typeof body === "string" ? [body] : body;
}

function LatestNewsReadMore({ href, label }: { href: string; label: string }) {
  const className = "text-select-text w-fit text-xs leading-4 font-medium underline";
  const isExternal = /^https?:\/\//.test(href);

  if (isExternal) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
        {label}
      </a>
    );
  }

  return (
    <Link href={href} className={className}>
      {label}
    </Link>
  );
}

function LatestNewsCard({ item, priority = false }: { item: LatestNewsItem; priority?: boolean }) {
  const paragraphs = newsBodyParagraphs(item.body);
  const readMoreLabel = item.readMoreLabel ?? LATEST_NEWS_READ_MORE_LABEL;

  return (
    <article className="flex flex-col gap-4" data-slot="latest-news-card">
      <div className="relative h-[180px] w-full overflow-hidden rounded-2xl">
        <Image
          src={item.imageSrc}
          alt={item.imageAlt ?? item.title}
          fill
          className="object-cover"
          sizes="(max-width: 390px) 100vw, 390px"
          priority={priority}
        />
      </div>

      <div className="flex flex-col gap-1">
        <h3 className="text-select-text text-base leading-6 font-medium">{item.title}</h3>
        {paragraphs.map((paragraph, index) => (
          <p key={index} className="text-modal-text text-sm leading-5 font-normal">
            {paragraph}
          </p>
        ))}
        {item.readMoreHref ? (
          <LatestNewsReadMore href={item.readMoreHref} label={readMoreLabel} />
        ) : (
          <span className="text-select-text w-fit text-xs leading-4 font-medium">
            {readMoreLabel}
          </span>
        )}
      </div>
    </article>
  );
}

function subscribeToNewsAutoOpen(onStoreChange: () => void) {
  const unsubscribeAge = subscribeToCookieKey(AGE_WARNING_COOKIE_NAME, onStoreChange);
  const unsubscribeCookie = subscribeToCookieKey(COOKIE_CONSENT_STORAGE_KEY, onStoreChange);
  const unsubscribeSeen = subscribeToBrowserStorageKey(LATEST_NEWS_SEEN_STORAGE_KEY, onStoreChange);
  return () => {
    unsubscribeAge();
    unsubscribeCookie();
    unsubscribeSeen();
  };
}

function useUnseenNewsItems(items: readonly LatestNewsItem[]): LatestNewsItem[] {
  const getSnapshot = React.useCallback(() => {
    if (!hasCompletedConsent()) return "";
    return getUnseenNewsItems(items)
      .map((item) => item.id)
      .join("\0");
  }, [items]);

  const unseenIds = React.useSyncExternalStore(subscribeToNewsAutoOpen, getSnapshot, () => "");
  const unseenIdSet = React.useMemo(
    () => new Set(unseenIds.split("\0").filter(Boolean)),
    [unseenIds],
  );

  return React.useMemo(
    () => items.filter((item) => unseenIdSet.has(item.id)),
    [items, unseenIdSet],
  );
}

export function LatestNewsPopup({
  trigger,
  open: openProp,
  defaultOpen,
  onOpenChange,
  items = LATEST_NEWS_ITEMS,
  autoOpen = true,
  title = LATEST_NEWS_TITLE,
  titleIconSrc = LATEST_NEWS_TITLE_ICON_SRC,
  onClose,
  className,
}: LatestNewsPopupProps) {
  const isControlled = openProp !== undefined;
  const unseenItems = useUnseenNewsItems(items);
  const [dismissed, setDismissed] = React.useState(false);

  const displayedItems = isControlled || !autoOpen ? items : unseenItems;
  const shouldAutoOpen = autoOpen && unseenItems.length > 0 && !dismissed;
  const uncontrolledOpen = Boolean(defaultOpen) || shouldAutoOpen;
  const open = isControlled ? Boolean(openProp) : uncontrolledOpen;

  const handleOpenChange = React.useCallback(
    (nextOpen: boolean) => {
      if (!nextOpen) {
        // Persist on dismiss, not on first paint: a React Strict Mode remount
        // would otherwise mark the visit seen and swallow the only showing.
        const idsToMark = (isControlled || !autoOpen ? items : unseenItems).map((item) => item.id);
        markNewsItemsSeen(idsToMark);
        setDismissed(true);
        onClose?.();
      }
      onOpenChange?.(nextOpen);
    },
    [autoOpen, isControlled, items, onClose, onOpenChange, unseenItems],
  );

  if (!open && !trigger) {
    return null;
  }

  if (displayedItems.length === 0 && !trigger) {
    return null;
  }

  return (
    <ModalLayout
      trigger={trigger}
      open={open}
      onOpenChange={handleOpenChange}
      title={title}
      titleIconSrc={titleIconSrc}
      showIcon
      showMobileHandle
      closeLabel={LATEST_NEWS_CLOSE_LABEL}
      closeClassName={LATEST_NEWS_CLOSE_CLASS}
      className={cn(LATEST_NEWS_MODAL_CLASS, className)}
    >
      <DialogDescription className="sr-only">{title}</DialogDescription>
      <div className={LATEST_NEWS_LIST_CLASS} data-slot="latest-news-popup">
        {displayedItems.map((item, index) => (
          <LatestNewsCard key={item.id} item={item} priority={index === 0} />
        ))}
      </div>
    </ModalLayout>
  );
}
