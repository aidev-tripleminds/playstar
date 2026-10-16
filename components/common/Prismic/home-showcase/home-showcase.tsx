"use client";

import Image from "next/image";
import * as React from "react";

import { Buttons } from "@/components/common/general/button/buttons";
import { GradientGrid } from "@/components/common/general/gradient-grid/gradient-grid";
import { useTryFreeCta } from "@/components/common/Prismic/cta/use-try-free-cta";
import { cn } from "@/lib/utils";

import { Badge } from "../../general/badge/badge";
import { PRISMIC_SECTION_CTA_CLASS } from "../section";
import {
  HOME_SHOWCASE_DEFAULT_CTA_LABEL,
  HOME_SHOWCASE_DEFAULT_HEADING,
  HOME_SHOWCASE_DEFAULT_IMAGES,
  HOME_SHOWCASE_HEADING_CLASS_BY_VARIANT,
  type HomeShowcaseImage,
  type HomeShowcaseVariant,
} from "./home-showcase.constants";

// ─── Card ─────────────────────────────────────────────────────────────────────

type CardProps = {
  image: HomeShowcaseImage;
  width: number;
  height: number;
  className?: string;
  style?: React.CSSProperties;
  priority?: boolean;
};

function ShowcaseCard({
  image,
  width,
  height,
  className = "",
  style,
  priority = false,
}: CardProps) {
  return (
    <div
      className={`overflow-hidden ${className}`}
      style={{
        width,
        height,
        padding: 1,
        borderRadius: 24,
        ...style,
      }}
    >
      {/* inner media wrapper */}
      <div
        className="relative h-full w-full overflow-hidden"
        style={{
          borderRadius: 24,
          border: "3px solid rgba(250, 250, 250, 0.8)",
        }}
      >
        {image.videoSrc ? (
          <video
            src={image.videoSrc}
            aria-label={image.alt || "Video preview"}
            muted
            playsInline
            preload="metadata"
            className="h-full w-full object-cover"
          />
        ) : (
          <Image
            src={image.src}
            alt={image.alt ?? ""}
            fill
            priority={priority}
            sizes={`${width}px`}
            className="object-cover"
          />
        )}
      </div>
    </div>
  );
}

// ─── HomeShowcase ─────────────────────────────────────────────────────────────

export type HomeShowcaseProps = React.ComponentProps<"section"> & {
  variant?: HomeShowcaseVariant;
  heading?: string;
  images?: HomeShowcaseImage[];
  ctaLabel?: string;
  /**
   * Makes the CTA navigate instead of firing `onCtaClick`, for CMS-authored
   * instances where the destination is editor-chosen. Renders a real `<a>`:
   * the `Buttons` atom is a `<button>` and can't be turned into one (several
   * children in one element rules out Radix's `Slot`/`asChild`). Takes
   * precedence over `onCtaClick`.
   */
  ctaHref?: string;
  signupSource?: string;
  count?: string | number;
  /** When false, the CTA is label-only — no `+10` / coin badge. */
  showCount?: boolean;
  showBackground?: boolean;
  showCta?: boolean;
  minOpacity?: number;
  maxOpacity?: number;
  onCtaClick?: React.ComponentProps<typeof Buttons>["onClick"];
};

export function HomeShowcase({
  variant = "default",
  heading = HOME_SHOWCASE_DEFAULT_HEADING,
  images = HOME_SHOWCASE_DEFAULT_IMAGES,
  ctaLabel = HOME_SHOWCASE_DEFAULT_CTA_LABEL,
  ctaHref,
  signupSource,
  count,
  showCount = true,
  showBackground = true,
  showCta = true,
  minOpacity = 0.35,
  maxOpacity = 0.55,
  onCtaClick,
  className = "",
  ...props
}: HomeShowcaseProps) {
  const hasHeading = heading.trim().length > 0;
  const hasImages = images.length > 0;
  const tryFree = useTryFreeCta(signupSource);
  // See the testimonial block: same shared CMS CTA contract (BACK-149).
  const resolvedCount = showCount ? (count ?? tryFree.bonusLabel) : undefined;
  const tokenBadge =
    resolvedCount != null && String(resolvedCount).trim().length > 0 ? (
      <span className="inline-flex items-center gap-[3px] text-[14px] leading-[14px] font-medium">
        {resolvedCount}
        <Badge type={"empty"} showText={false} className="p-[1px]" />
      </span>
    ) : null;
  const resolvedOnCtaClick = onCtaClick ?? tryFree.onClick;
  // The shared CTA behaviour is a DEFAULT, not an override: a caller that
  // supplies its own handler keeps its button, and only a CTA with neither a
  // destination nor a handler becomes the try-free CTA. Without this, a
  // logged-in visitor would turn an explicit `onCtaClick` into an /explore
  // link and silently drop the caller's action.
  const resolvedCtaHref = ctaHref ?? (onCtaClick ? undefined : tryFree.href);

  const hasCta = showCta && ctaLabel.trim().length > 0;

  if (!hasHeading && !hasImages && !hasCta) return null;

  const leftImage = images.length > 1 ? images[0] : undefined;
  const centerImage = images[1] ?? images[0];
  const rightImage = images[2];

  return (
    <section
      data-slot="home-showcase"
      data-variant={variant}
      className={cn(
        "text-tooltip-text relative isolate mx-auto flex flex-col items-center justify-center gap-4 py-4 text-center font-['Onest']",
        className,
      )}
      style={{ maxWidth: 554 }}
      {...props}
    >
      {/* ── Cards cluster ── */}
      {hasImages && (
        <div className="relative isolate z-[1] flex h-[184px] flex-shrink-0 flex-col items-center justify-center">
          {showBackground ? (
            <div
              data-slot="home-showcase-background"
              className="pointer-events-none absolute top-1/2 left-1/2 -z-10 h-[259px] w-[447px] -translate-x-1/2 -translate-y-1/2"
              aria-hidden
            >
              <GradientGrid
                className="showcase-gradient h-full w-full"
                radialGradient="var(--gradient-showcase)"
                minOpacity={minOpacity}
                maxOpacity={maxOpacity}
              />
            </div>
          ) : null}

          {/* Left card */}
          {leftImage && (
            <ShowcaseCard
              image={leftImage}
              width={110.5}
              height={133.2}
              className="absolute left-1/2 z-0"
              style={{
                transform: `translateX(calc(-50% - 90px)) rotate(-6deg)`,
                borderRadius: 24,
              }}
            />
          )}

          {/* Center card — largest, on top */}
          <ShowcaseCard
            image={centerImage}
            width={125}
            height={156.3}
            className="relative z-10"
            style={{ borderRadius: 24 }}
            priority
          />

          {/* Right card */}
          {rightImage && (
            <ShowcaseCard
              image={rightImage}
              width={110.5}
              height={133.2}
              className="absolute left-1/2 z-0"
              style={{
                transform: `translateX(calc(-50% + 90px)) rotate(6deg)`,
                borderRadius: 24,
              }}
            />
          )}
        </div>
      )}

      {/* ── Heading ── */}
      {hasHeading && (
        <h2
          data-slot="home-showcase-heading"
          className={cn(
            "z-[2] flex-shrink-0",
            HOME_SHOWCASE_HEADING_CLASS_BY_VARIANT[variant],
            variant === "compact" && "w-[334px]",
          )}
        >
          {heading}
        </h2>
      )}

      {/* ── CTA button ── */}
      {hasCta && resolvedCtaHref && (
        <a
          data-slot="home-showcase-cta"
          href={resolvedCtaHref}
          className={cn(PRISMIC_SECTION_CTA_CLASS, "z-[3]")}
        >
          {ctaLabel}
          {tokenBadge}
        </a>
      )}

      {hasCta && !resolvedCtaHref && (
        <Buttons
          data-slot="home-showcase-cta"
          type="button"
          variant="rose"
          size="btn-m"
          label={ctaLabel}
          leftIcon={false}
          rightIcon={false}
          className="z-[3] w-fit gap-1.5 text-sm!"
          onClick={resolvedOnCtaClick}
        >
          {tokenBadge}
        </Buttons>
      )}
    </section>
  );
}

// ─── Storyboard / Figma frame wrapper ────────────────────────────────────────
// Renders both variants exactly as laid out in the Figma file.
// Use in Storybook or dev only — not in production.

export function HomeShowcaseSet() {
  return (
    <div className="border-brand-blue text-tooltip-text relative box-border h-[890px] w-full overflow-hidden rounded-[5px] border border-dashed font-['Onest']">
      {/* Default variant — top: 20, left: 20 */}
      <div className="absolute top-5 left-5">
        <HomeShowcase variant="default" />
      </div>

      {/* Compact variant — top: 471, left: 20 */}
      <div className="absolute top-[471px] left-5">
        <HomeShowcase variant="compact" />
      </div>
    </div>
  );
}

export default HomeShowcaseSet;
