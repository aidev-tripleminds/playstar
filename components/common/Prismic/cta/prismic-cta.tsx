"use client";

import * as React from "react";

import { Badge } from "@/components/common/general/badge/badge";
import { cn } from "@/lib/utils";

import { useTryFreeCta } from "./use-try-free-cta";

export type PrismicCtaProps = {
  label: string;
  /**
   * Editor-supplied override (`cta_link`). When filled the CTA is a plain link
   * to it; when empty — the ordinary case — it becomes the fixed "Try for
   * free" button that opens the signup modal.
   */
  href?: string;
  signupSource?: string;
  className?: string;
  badgeClassName?: string;
  /**
   * Whether to render the "+N" bonus pill. Defaults to true. The blocks whose
   * CTA never carried a badge (feature block / feature boxes) opt out, so
   * unifying the BEHAVIOUR of every CMS CTA does not silently restyle pages
   * that are already published.
   */
  showBonus?: boolean;
  "data-slot"?: string;
};

/**
 * The shared CMS CTA: same markup and classes as the anchor these callers used
 * to render inline, but with the bonus badge resolved from backend config and
 * the no-link case wired to signup (BACK-149).
 *
 * A client component because the signup case needs an `onClick` — a server
 * slice cannot pass a function across the RSC boundary, so the behaviour is
 * owned here rather than injected. The badge number likewise cannot be
 * authored in Prismic: it must agree with what the backend actually grants.
 */
export function PrismicCta({
  label,
  href,
  signupSource,
  className,
  badgeClassName,
  showBonus = true,
  "data-slot": dataSlot = "prismic-cta",
}: PrismicCtaProps) {
  const tryFree = useTryFreeCta(signupSource);
  // Editor override first, then the logged-in /explore link, then the action.
  const resolvedHref = href ?? tryFree.href;

  const badge = showBonus ? (
    <Badge className={cn(badgeClassName)} text={tryFree.bonusLabel} type="empty" />
  ) : null;

  if (resolvedHref) {
    return (
      <a data-slot={dataSlot} href={resolvedHref} className={className}>
        {label}
        {badge}
      </a>
    );
  }

  return (
    <button data-slot={dataSlot} type="button" onClick={tryFree.onClick} className={className}>
      {label}
      {badge}
    </button>
  );
}
