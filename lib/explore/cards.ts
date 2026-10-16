import type { HomepageGridItem } from "@/components/pages/homepage/_lib/constants";
import { HOMEPAGE_PREMIUM_COUNTDOWN_CARD_ENABLED } from "@/lib/feature-flags";

/** Absolute positions across the flattened feed, with no lost content rows. */
export function injectExploreCards(
  items: HomepageGridItem[],
  mobile: boolean,
  flags: { resolved: boolean; hasCreated: boolean; premium: boolean },
  cards: { create: HomepageGridItem; premium: HomepageGridItem },
): HomepageGridItem[] {
  if (!flags.resolved) return items;
  const result = [...items];
  if (!flags.hasCreated) result.splice(0, 0, cards.create);
  const premiumIndex = mobile ? 3 : 6;
  // A short first page must not put the offer at the wrong position. It will
  // enter at its absolute position when enough content is loaded.
  // FRONT-657: hide the buy-premium countdown tile until it is re-enabled.
  if (HOMEPAGE_PREMIUM_COUNTDOWN_CARD_ENABLED && !flags.premium && result.length >= premiumIndex) {
    result.splice(premiumIndex, 0, cards.premium);
  }
  return result;
}
