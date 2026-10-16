import Image from "next/image";
import Link from "next/link";
import * as React from "react";

import { cn } from "@/lib/utils";

import {
  FOOTER_BOTTOM_CLASS,
  FOOTER_COLUMN_TITLE_CLASS,
  FOOTER_COLUMNS_CLASS,
  FOOTER_COMPANY_ADDRESS,
  FOOTER_COPYRIGHT_CLASS,
  FOOTER_COPYRIGHT_PREFIX,
  FOOTER_DEFAULT_COPYRIGHT,
  FOOTER_DEFAULT_EMAIL,
  FOOTER_DEFAULT_LINK_GROUPS,
  FOOTER_EMAIL_CLASS,
  FOOTER_EVERYSHIELD_LOGO_SRC,
  FOOTER_EVERYSHIELD_TEXT,
  FOOTER_INNER_CLASS,
  FOOTER_LEGAL_LINK_CLASS,
  FOOTER_LEGAL_ROW_CLASS,
  FOOTER_LEGAL_SEPARATOR_CLASS,
  FOOTER_LINK_CLASS,
  FOOTER_LINK_LIST_CLASS,
  FOOTER_LOGO_SRC,
  FOOTER_LOGO_WIDTH_PX,
  FOOTER_PADDING_X_PX,
  FOOTER_PADDING_Y_PX,
  FOOTER_PAYMENT_MASTERCARD_SRC,
  FOOTER_PAYMENT_VISA_SRC,
  FOOTER_PAYMENT_VOLT_SRC,
  FOOTER_SITEMAP_HREF,
  FOOTER_SITEMAP_LABEL,
  FOOTER_SITEMAP_LINK_CLASS,
  FOOTER_SOCIAL_LINK_CLASS,
  FOOTER_SURFACE_CLASS,
  FOOTER_WIDTH_PX,
  type FooterLink,
  type FooterLinkGroup,
} from "./footer.constants";
import { FooterSocialIcon, hasFooterSocialIcon } from "./footer-social-icon";

export type FooterProps = React.ComponentProps<"footer"> & {
  linkGroups?: FooterLinkGroup[];
  legalLinks: FooterLink[];
  copyright?: string;
  email?: string;
  companyAddress?: string;
  logoSrc?: string;
  logoHref?: string;
};

function FooterLegalSeparator() {
  return <li aria-hidden className={FOOTER_LEGAL_SEPARATOR_CLASS}></li>;
}

export function Footer({
  linkGroups = FOOTER_DEFAULT_LINK_GROUPS,
  legalLinks,
  copyright = FOOTER_DEFAULT_COPYRIGHT,
  email = FOOTER_DEFAULT_EMAIL,
  companyAddress = FOOTER_COMPANY_ADDRESS,
  logoSrc = FOOTER_LOGO_SRC,
  logoHref = "/",
  className,
  ...props
}: FooterProps) {
  const hasLegalLinks = legalLinks.length > 0;
  const hasCopyright = copyright.trim().length > 0;
  const hasEmail = email.trim().length > 0;
  const hasLegalRow = hasLegalLinks || hasEmail;

  return (
    <footer data-slot="footer" className={cn(FOOTER_SURFACE_CLASS, className)} {...props}>
      <div
        data-slot="footer-inner"
        className={FOOTER_INNER_CLASS}
        style={{
          maxWidth: FOOTER_WIDTH_PX,
          paddingLeft: FOOTER_PADDING_X_PX,
          paddingRight: FOOTER_PADDING_X_PX,
          paddingTop: FOOTER_PADDING_Y_PX,
          paddingBottom: FOOTER_PADDING_Y_PX,
        }}
      >
        {/*
          Always rendered, even with no link groups: this block is the footer's
          own chrome — logo, company address, payment marks, moderation badge —
          and none of it comes from `linkGroups`. Gating the whole <nav> on them
          meant publishing a Prismic `footer` document with an empty
          social-links group (a supported editorial choice, BACK-154) blanked
          the entire top half of the footer, not just the socials column.
        */}
        <nav aria-label="Footer" data-slot="footer-nav">
          <div className={FOOTER_COLUMNS_CLASS}>
            <div
              data-slot="footer-brand"
              className="logo-main flex flex-col gap-4 md:block lg:block"
            >
              <Link href={logoHref} aria-label="Spicestars home" className="w-fit">
                <span className="relative block">
                  <Image
                    src={logoSrc}
                    alt="Spicestars"
                    width={145}
                    height={29}
                    sizes={`${FOOTER_LOGO_WIDTH_PX}px`}
                    className="object-contain object-left"
                  />
                </span>
              </Link>
              <p className="text-cookie-bg text-[14px] leading-5 whitespace-pre-line lg:pt-5">
                {companyAddress}
              </p>
              <div
                data-slot="footer-payment-icons"
                className="social-icons flex gap-3 md:gap-5 lg:mt-5 lg:gap-5"
              >
                <Image
                  src={FOOTER_PAYMENT_MASTERCARD_SRC}
                  alt="Mastercard"
                  width={56}
                  height={34}
                  className="object-contain"
                />
                <Image
                  src={FOOTER_PAYMENT_VISA_SRC}
                  alt="Visa"
                  width={56}
                  height={34}
                  className="object-contain"
                />
                <Image
                  src={FOOTER_PAYMENT_VOLT_SRC}
                  alt="Volt"
                  width={56}
                  height={34}
                  className="object-contain"
                />
              </div>
              <div data-slot="footer-evershield" className="evershield mt-5 flex flex-col gap-2">
                <Image
                  src={FOOTER_EVERYSHIELD_LOGO_SRC}
                  alt="EverShield AI"
                  width={145}
                  height={31}
                  className="object-contain"
                />
                <p className="text-[var(--cookie-bg)]">{FOOTER_EVERYSHIELD_TEXT}</p>
              </div>
            </div>

            {linkGroups.map((group) => (
              <div key={group.id} data-slot="footer-column">
                <h2 className={FOOTER_COLUMN_TITLE_CLASS}>{group.title}</h2>
                <ul className={FOOTER_LINK_LIST_CLASS}>
                  {group.links.map((link) => (
                    <li key={link.id}>
                      <Link
                        href={link.href}
                        className={
                          hasFooterSocialIcon(link) ? FOOTER_SOCIAL_LINK_CLASS : FOOTER_LINK_CLASS
                        }
                      >
                        <FooterSocialIcon link={link} />
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </nav>

        {hasCopyright || hasLegalRow ? (
          <div data-slot="footer-bottom" className={FOOTER_BOTTOM_CLASS}>
            {hasCopyright ? (
              <p data-slot="footer-copyright" className={FOOTER_COPYRIGHT_CLASS}>
                {copyright === FOOTER_DEFAULT_COPYRIGHT ? (
                  <>
                    {FOOTER_COPYRIGHT_PREFIX}
                    <Link href={FOOTER_SITEMAP_HREF} className={FOOTER_SITEMAP_LINK_CLASS}>
                      {FOOTER_SITEMAP_LABEL}
                    </Link>
                  </>
                ) : (
                  copyright
                )}
              </p>
            ) : null}

            {hasLegalRow ? (
              <nav aria-label="Footer legal" data-slot="footer-legal">
                <ul className={FOOTER_LEGAL_ROW_CLASS}>
                  {legalLinks.map((link, index) => (
                    <React.Fragment key={link.id}>
                      {index > 0 ? <FooterLegalSeparator /> : null}
                      <li>
                        <Link href={link.href} className={FOOTER_LEGAL_LINK_CLASS}>
                          {link.label}
                        </Link>
                      </li>
                    </React.Fragment>
                  ))}
                  {hasEmail ? (
                    <>
                      {hasLegalLinks ? <FooterLegalSeparator /> : null}
                      <li>
                        <a
                          href={`mailto:${email}`}
                          data-slot="footer-email"
                          className={FOOTER_EMAIL_CLASS}
                        >
                          {email}
                        </a>
                      </li>
                    </>
                  ) : null}
                </ul>
              </nav>
            ) : null}
          </div>
        ) : null}
      </div>
    </footer>
  );
}
