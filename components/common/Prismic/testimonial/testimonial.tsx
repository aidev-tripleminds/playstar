"use client";

import * as React from "react";

import { Buttons } from "@/components/common/general/button/buttons";
import { useTryFreeCta } from "@/components/common/Prismic/cta/use-try-free-cta";
import { useIsDesktop } from "@/hooks/use-is-desktop";
import { cn } from "@/lib/utils";
import { IcoginitoIcon } from "@/public/assets/icons/incogonito";
import { ShieldIcon } from "@/public/assets/icons/sheild";
import { TestimonialStar } from "@/public/assets/icons/testimonial-star";

import { Badge } from "../../general/badge/badge";
import {
  TESTIMONIAL_AUTHOR_NAME_CLASS,
  TESTIMONIAL_AUTHOR_SOURCE_CLASS,
  TESTIMONIAL_CARD_CLASS,
  TESTIMONIAL_DEFAULT_AUTHOR_NAME,
  TESTIMONIAL_DEFAULT_AUTHOR_SOURCE,
  TESTIMONIAL_DEFAULT_ITEMS,
  TESTIMONIAL_DEFAULT_QUOTE,
  TESTIMONIAL_DEFAULT_RATING,
  TESTIMONIAL_MAX_RATING,
  TESTIMONIAL_QUOTE_CLASS,
  TESTIMONIAL_RATING_CLASS,
  TESTIMONIAL_STAR_BG_COLOR,
  TESTIMONIAL_STAR_SIZE_PX,
  type TestimonialItem,
  TESTIMONIALS_CTA_LINK_CLASS,
  TESTIMONIALS_DEFAULT_CTA_LABEL,
  TESTIMONIALS_DEFAULT_HEADING,
  TESTIMONIALS_DEFAULT_TRUST_BADGES,
  TESTIMONIALS_GRID_CLASS,
  TESTIMONIALS_HEADING_CLASS,
  TESTIMONIALS_MAX_WIDTH_PX,
  TESTIMONIALS_MOBILE_CTA_LABEL,
  TESTIMONIALS_PADDING_X_PX,
  TESTIMONIALS_PADDING_Y_PX,
  TESTIMONIALS_SECTION_CLASS,
  TESTIMONIALS_TRUST_ITEM_CLASS,
  TESTIMONIALS_TRUST_ITEM_WIDTH_DESKTOP_PX,
  TESTIMONIALS_TRUST_ITEM_WIDTH_MOBILE_PX,
  TESTIMONIALS_TRUST_LABEL_CLASS,
  TESTIMONIALS_TRUST_ROW_CLASS,
  type TestimonialTrustBadge,
} from "./testimonial.constants";

function clampRating(rating: number) {
  return Math.min(TESTIMONIAL_MAX_RATING, Math.max(0, Math.round(rating)));
}

function renderLabelLines(text: string) {
  return text.split("\n").map((line, index, lines) => (
    <React.Fragment key={`${line}-${index}`}>
      {line}
      {index < lines.length - 1 ? <br /> : null}
    </React.Fragment>
  ));
}

export type TestimonialProps = React.ComponentProps<"figure"> & {
  quote?: string;
  authorName?: string;
  authorSource?: string;
  rating?: number;
  showRating?: boolean;
};

export function Testimonial({
  quote = TESTIMONIAL_DEFAULT_QUOTE,
  authorName = TESTIMONIAL_DEFAULT_AUTHOR_NAME,
  authorSource = TESTIMONIAL_DEFAULT_AUTHOR_SOURCE,
  rating = TESTIMONIAL_DEFAULT_RATING,
  showRating = true,
  className,
  ...props
}: TestimonialProps) {
  const hasQuote = quote.trim().length > 0;
  const hasAuthorName = authorName.trim().length > 0;
  const hasAuthorSource = authorSource.trim().length > 0;
  const resolvedRating = clampRating(rating);

  if (!hasQuote && !hasAuthorName && !hasAuthorSource) return null;

  return (
    <figure data-slot="testimonial" className={cn(TESTIMONIAL_CARD_CLASS, className)} {...props}>
      {hasQuote ? (
        <blockquote data-slot="testimonial-quote" className={TESTIMONIAL_QUOTE_CLASS}>
          &ldquo;{quote}&rdquo;
        </blockquote>
      ) : null}

      {hasAuthorName || hasAuthorSource ? (
        <figcaption data-slot="testimonial-author" className="flex flex-col items-center gap-1">
          {hasAuthorName ? (
            <div
              data-slot="testimonial-author-name"
              className={cn(TESTIMONIAL_AUTHOR_NAME_CLASS, "not-italic!")}
            >
              {authorName}
            </div>
          ) : null}
          {hasAuthorSource ? (
            <span data-slot="testimonial-author-source" className={TESTIMONIAL_AUTHOR_SOURCE_CLASS}>
              {authorSource}
            </span>
          ) : null}
        </figcaption>
      ) : null}

      {showRating && resolvedRating > 0 ? (
        <div
          data-slot="testimonial-rating"
          className={TESTIMONIAL_RATING_CLASS}
          role="img"
          aria-label={`${resolvedRating} out of ${TESTIMONIAL_MAX_RATING} stars`}
        >
          {Array.from({ length: TESTIMONIAL_MAX_RATING }, (_, index) => {
            const isFilled = index < resolvedRating;

            return (
              <span
                key={index}
                aria-hidden
                className={cn(
                  "inline-flex items-center justify-center rounded-[2px]",
                  !isFilled && "opacity-30",
                )}
                style={{
                  width: TESTIMONIAL_STAR_SIZE_PX,
                  height: TESTIMONIAL_STAR_SIZE_PX,
                  backgroundColor: isFilled ? TESTIMONIAL_STAR_BG_COLOR : TESTIMONIAL_STAR_BG_COLOR,
                }}
              >
                <TestimonialStar />
              </span>
            );
          })}
        </div>
      ) : null}
    </figure>
  );
}

export type TestimonialsProps = React.ComponentProps<"section"> & {
  heading?: string;
  count?: string | number;
  items?: TestimonialItem[];
  trustBadges?: TestimonialTrustBadge[];
  ctaLabel?: string;
  ctaMobileLabel?: string;
  /**
   * Makes the CTA navigate instead of firing `onCtaClick`, for CMS-authored
   * instances where the destination is editor-chosen. Renders a real `<a>`:
   * the `Buttons` atom is a `<button>` and can't be turned into one (it puts
   * several children in a single element, so Radix's `Slot`/`asChild`
   * single-child rule rules it out). Takes precedence over `onCtaClick`.
   */
  ctaHref?: string;
  signupSource?: string;
  showTrustBadges?: boolean;
  showCta?: boolean;
  onCtaClick?: React.ComponentProps<typeof Buttons>["onClick"];
};

export function Testimonials({
  heading = TESTIMONIALS_DEFAULT_HEADING,
  items = TESTIMONIAL_DEFAULT_ITEMS,
  trustBadges = [...TESTIMONIALS_DEFAULT_TRUST_BADGES],
  ctaLabel = TESTIMONIALS_DEFAULT_CTA_LABEL,
  ctaMobileLabel = TESTIMONIALS_MOBILE_CTA_LABEL,
  ctaHref,
  signupSource,
  count,
  showTrustBadges = true,
  showCta = true,
  onCtaClick,
  className,
  ...props
}: TestimonialsProps) {
  const isDesktop = useIsDesktop();
  const tryFree = useTryFreeCta(signupSource);
  // Both fall back to the shared CMS CTA contract (BACK-149): the bonus shown
  // is whatever the backend grants, and a CTA with no link opens signup.
  const resolvedCount = count ?? tryFree.bonusLabel;
  const resolvedOnCtaClick = onCtaClick ?? tryFree.onClick;
  // The shared CTA behaviour is a DEFAULT, not an override: a caller that
  // supplies its own handler keeps its button, and only a CTA with neither a
  // destination nor a handler becomes the try-free CTA. Without this, a
  // logged-in visitor would turn an explicit `onCtaClick` into an /explore
  // link and silently drop the caller's action.
  const resolvedCtaHref = ctaHref ?? (onCtaClick ? undefined : tryFree.href);

  const resolvedCtaLabel = isDesktop ? ctaLabel : ctaMobileLabel;
  const hasHeading = heading.trim().length > 0;
  const hasItems = items.length > 0;
  const hasTrustBadges = showTrustBadges && trustBadges.length > 0;
  const hasCta = showCta && resolvedCtaLabel.trim().length > 0;

  if (!hasHeading && !hasItems && !hasTrustBadges && !hasCta) return null;

  return (
    <section
      data-slot="testimonials"
      className={cn(TESTIMONIALS_SECTION_CLASS, className)}
      style={{
        maxWidth: TESTIMONIALS_MAX_WIDTH_PX,
        paddingLeft: TESTIMONIALS_PADDING_X_PX,
        paddingRight: TESTIMONIALS_PADDING_X_PX,
        paddingTop: TESTIMONIALS_PADDING_Y_PX,
        paddingBottom: TESTIMONIALS_PADDING_Y_PX,
      }}
      {...props}
    >
      {hasHeading ? (
        <p data-slot="testimonials-heading" className={TESTIMONIALS_HEADING_CLASS}>
          {renderLabelLines(heading)}
        </p>
      ) : null}

      {hasItems ? (
        <div data-slot="testimonials-grid" className={TESTIMONIALS_GRID_CLASS}>
          {items.map((item) => (
            <Testimonial
              key={item.id}
              quote={item.quote}
              authorName={item.authorName}
              authorSource={item.authorSource}
              rating={item.rating}
            />
          ))}
        </div>
      ) : null}

      {hasTrustBadges ? (
        <div data-slot="testimonials-trust" className={TESTIMONIALS_TRUST_ROW_CLASS}>
          {trustBadges.map((badge) => (
            <div
              key={badge.id}
              data-slot="testimonials-trust-item"
              className={TESTIMONIALS_TRUST_ITEM_CLASS}
              style={{
                width: isDesktop
                  ? TESTIMONIALS_TRUST_ITEM_WIDTH_DESKTOP_PX
                  : TESTIMONIALS_TRUST_ITEM_WIDTH_MOBILE_PX,
              }}
            >
              <span className="text-modal-text relative inline-block shrink-0">
                {badge.id === "shield" ? <ShieldIcon /> : <IcoginitoIcon />}
              </span>

              <span
                data-slot="testimonials-trust-label"
                aria-label={badge.label}
                className={TESTIMONIALS_TRUST_LABEL_CLASS}
              >
                <span
                  data-slot="testimonials-trust-label-mobile"
                  className="flex flex-col md:hidden"
                >
                  {badge.mobileLines.map((line) => (
                    <span key={line}>{line}</span>
                  ))}
                </span>
                <span data-slot="testimonials-trust-label-desktop" className="hidden md:inline">
                  {badge.label}
                </span>
              </span>
            </div>
          ))}
        </div>
      ) : null}

      {hasCta && resolvedCtaHref ? (
        <a
          data-slot="testimonials-cta"
          href={resolvedCtaHref}
          className={cn(TESTIMONIALS_CTA_LINK_CLASS, "mt-4")}
        >
          {resolvedCtaLabel}
          <Badge
            className="gap-[3px] px-0 text-[14px]! leading-[14px]!"
            text={resolvedCount}
            type="empty"
          />
        </a>
      ) : null}

      {hasCta && !resolvedCtaHref ? (
        <Buttons
          data-slot="testimonials-cta"
          className="mt-4 w-fit gap-1.5 text-sm!"
          type="button"
          variant="rose"
          size="btn-m"
          label={resolvedCtaLabel}
          leftIcon={false}
          rightIcon={false}
          rightIconSizeClassName="h-[12px] w-[12px]"
          onClick={resolvedOnCtaClick}
        >
          <Badge
            className="gap-[3px] px-0 text-[14px]! leading-[14px]!"
            text={resolvedCount}
            type="empty"
          />
        </Buttons>
      ) : null}
    </section>
  );
}
