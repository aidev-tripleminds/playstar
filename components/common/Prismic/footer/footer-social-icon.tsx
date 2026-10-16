import Image from "next/image";
import * as React from "react";

import { cn } from "@/lib/utils";
import {
  DiscordIcon,
  InstagramIcon,
  RedditIcon,
  RedgifsIcon,
  TiktokIcon,
  TwitterIcon,
} from "@/public/assets/icons";

import { FOOTER_SOCIAL_ICON_SIZE_PX, type FooterLink } from "./footer.constants";

/**
 * Built-in glyph per `platform`. Keyed loosely (`string`) rather than by
 * `FooterSocialPlatform` because a CMS-authored link's id carries an index
 * suffix and a hand-written default link has none — both fall back to the id,
 * and an unknown key simply has no built-in icon.
 */
export const FOOTER_SOCIAL_ICONS: Record<
  string,
  React.ComponentType<React.SVGProps<SVGSVGElement>>
> = {
  reddit: RedditIcon,
  x: TwitterIcon,
  discord: DiscordIcon,
  instagram: InstagramIcon,
  tiktok: TiktokIcon,
  redgifs: RedgifsIcon,
};

/** True when the link has any icon to draw — lets a caller pick its icon/no-icon layout class. */
export function hasFooterSocialIcon(link: FooterLink): boolean {
  return Boolean(link.iconUrl) || Boolean(FOOTER_SOCIAL_ICONS[link.icon ?? link.id]);
}

/**
 * One social icon, resolved the same way everywhere it is drawn (footer
 * column, `/sitemap`): an `iconUrl` authored in the back office wins, otherwise
 * the built-in glyph for the selected platform, otherwise nothing.
 *
 * A CMS icon is decorative next to its own visible label, so it renders with an
 * empty `alt` — the label already names the destination, and a second copy of
 * it only makes a screen reader say it twice.
 */
export function FooterSocialIcon({
  link,
  size = FOOTER_SOCIAL_ICON_SIZE_PX,
  slot = "footer-social-icon",
  className,
}: {
  link: FooterLink;
  size?: number;
  slot?: string;
  /** Extra classes for the drawn icon — the side nav sizes its rail this way. */
  className?: string;
}) {
  if (link.iconUrl) {
    /**
     * `unoptimized` is REQUIRED here, not a performance trade-off: the URL is
     * free text an editor pastes, so its host is unknowable at build time and
     * `next/image`'s optimizer rejects (502s) any host missing from
     * `next.config.ts` remotePatterns. Unoptimized sources are served as-is and
     * skip that allowlist. They are 16px icons — there is nothing to optimize.
     *
     * The box is pinned to the icon size and `object-contain` letterboxes
     * whatever aspect ratio turns up, so a 512px PNG cannot blow out the
     * column and a non-square one is not squashed.
     */
    return (
      <Image
        src={link.iconUrl}
        alt=""
        width={size}
        height={size}
        unoptimized
        aria-hidden
        data-slot={slot}
        className={cn("shrink-0 object-contain", className)}
        style={{ width: size, height: size }}
      />
    );
  }

  const Icon = FOOTER_SOCIAL_ICONS[link.icon ?? link.id];
  if (!Icon) return null;

  return (
    <Icon
      width={size}
      height={size}
      aria-hidden
      className={cn("shrink-0", className)}
      data-slot={slot}
    />
  );
}
