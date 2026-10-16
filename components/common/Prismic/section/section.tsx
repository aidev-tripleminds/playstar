import * as React from "react";

import { PrismicCta } from "@/components/common/Prismic/cta/prismic-cta";
import { cn } from "@/lib/utils";

import {
  PRISMIC_SECTION_BODY_CLASS,
  PRISMIC_SECTION_CTA_BADGE_CLASS,
  PRISMIC_SECTION_CTA_CLASS,
  PRISMIC_SECTION_HEADING_CLASS,
  PRISMIC_SECTION_SHELL_CLASS,
  type PrismicSectionCta,
} from "./section.constants";

export type PrismicSectionProps = Omit<React.ComponentProps<"div">, "title"> & {
  /** Optional heading. Omitted entirely when blank — never an empty `<h2>`. */
  title?: string;
  cta?: PrismicSectionCta;
  /** Heading + CTA alignment. Defaults to "center", matching every existing caller. */
  align?: "left" | "center";
};

/**
 * The heading + body + CTA chrome every CMS-authored lower-stack section
 * shares, extracted from the hand-coded homepage blocks so an editor-authored
 * section is indistinguishable from one written in code.
 *
 * Slices supply only their own content as `children`; spacing between sections
 * comes from the parent stack, not from here.
 */
export function PrismicSection({
  title,
  cta,
  align = "center",
  children,
  className,
  ...props
}: PrismicSectionProps) {
  const hasTitle = Boolean(title?.trim());

  return (
    <div
      data-slot="prismic-section"
      className={cn(PRISMIC_SECTION_SHELL_CLASS, className)}
      {...props}
    >
      {hasTitle ? (
        <h2
          data-slot="prismic-section-heading"
          className={cn(PRISMIC_SECTION_HEADING_CLASS, align === "left" && "text-left!")}
        >
          {title}
        </h2>
      ) : null}

      <div
        data-slot="prismic-section-body"
        className={cn(PRISMIC_SECTION_BODY_CLASS, align === "left" && "items-start")}
      >
        {children}

        {cta ? (
          <PrismicCta
            data-slot="prismic-section-cta"
            label={cta.label}
            href={cta.href}
            signupSource={cta.signupSource}
            className={PRISMIC_SECTION_CTA_CLASS}
            badgeClassName={PRISMIC_SECTION_CTA_BADGE_CLASS}
          />
        ) : null}
      </div>
    </div>
  );
}
