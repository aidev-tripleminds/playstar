import * as React from "react";

import { PrismicSection, type PrismicSectionCta } from "@/components/common/Prismic/section";

import { AccordionBlock } from "./accordion-block";
import type { AccordionBlockItem } from "./accordion-block.constants";
import { FAQ_SECTION_ACCORDION_CLASS } from "./faq-section.constants";

export type FaqSectionProps = Omit<React.ComponentProps<"div">, "children" | "title"> & {
  /** Optional section heading. Omitted entirely when blank — no empty `<h2>`. */
  title?: string;
  items: AccordionBlockItem[];
  /** Optional closing CTA below the accordion, matching the homepage's. */
  cta?: PrismicSectionCta;
};

/**
 * A complete FAQ section: centered heading, full-width accordion, optional CTA.
 *
 * Extracted so CMS-authored FAQs render identically to the hand-coded homepage
 * one rather than approximating it — a slice reproducing it by eye would drift
 * the first time either side was restyled.
 */
export function FaqSection({ title, items, cta, ...props }: FaqSectionProps) {
  if (items.length === 0) return null;

  return (
    <PrismicSection title={title} cta={cta} {...props}>
      <AccordionBlock items={items} className={FAQ_SECTION_ACCORDION_CLASS} />
    </PrismicSection>
  );
}
