"use client";

import Link from "next/link";
import * as React from "react";

import { ROUTES } from "@/lib/routes";
import { cn } from "@/lib/utils";

import { usePromoBannerCta } from "./use-promo-banner-cta";

export type PromoBannerCtaProps = {
  children: React.ReactNode;
  className?: string;
};

/**
 * Makes a promo image (header hero or Prismic Banner slice) open signup when
 * logged out and the pricing page when logged in (FRONT-695).
 *
 * Always an `<a>` so a click still does something if it lands before the
 * client tree hydrates: guests are sent to `/premium` (which prompts auth),
 * and after hydration that same click is intercepted to open signup instead.
 */
export function PromoBannerCta({ children, className }: PromoBannerCtaProps) {
  const { href, onClick } = usePromoBannerCta();
  const isLoggedIn = Boolean(href);
  const classes = cn(
    "m-0 block w-full cursor-pointer border-0 bg-transparent p-0 text-inherit no-underline",
    className,
  );

  return (
    <Link
      href={href ?? ROUTES.premium}
      data-slot="promo-banner-cta"
      className={classes}
      aria-label={isLoggedIn ? "View pricing" : "Sign up"}
      onClick={(event) => {
        if (isLoggedIn) return;
        event.preventDefault();
        onClick();
      }}
    >
      {children}
    </Link>
  );
}
