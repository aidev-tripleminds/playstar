/**
 * FAQ-specific presentation. The surrounding chrome (shell, heading, body,
 * CTA) is shared with every other CMS-authored section — see
 * `components/common/Prismic/section`.
 */

/**
 * Byte-identical to HOMEPAGE_FAQ_ACCORDION_BLOCK_CLASS, so a CMS-authored FAQ
 * matches the hand-coded homepage one. Duplicated rather than imported because
 * a shared `components/common/*` module must not depend on a page's private
 * `_lib`; `faq-section.test.tsx` asserts they stay identical.
 */
export const FAQ_SECTION_ACCORDION_CLASS =
  "!m-0 w-full max-w-none [&_[data-slot=accordion-item]]:!w-full [&_[data-slot=accordion-item]]:!min-w-0 [&_[data-slot=accordion-item]]:!max-w-none";
