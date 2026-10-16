"use client";

import Image from "next/image";
import * as React from "react";

import { Badge } from "@/components/common/general/badge/badge";
import { Buttons } from "@/components/common/general/button/buttons";
import { GradientGrid } from "@/components/common/general/gradient-grid/gradient-grid";
import { resolveCountdownInitialMs, useCountdown } from "@/hooks/use-countdown";
import { useAssetImage } from "@/lib/assets/asset-map-context";
import { cn } from "@/lib/utils";

import {
  HOME_CARD_COUNTDOWN_INITIAL_MS,
  HOME_CARD_COUNTDOWN_LABEL_CLASS_BY_SIZE,
  HOME_CARD_COUNTDOWN_ROW_CLASS_BY_SIZE,
  HOME_CARD_COUNTDOWN_TICK_INTERVAL_MS,
  HOME_CARD_COUNTDOWN_UNIT_CLASS_BY_SIZE,
  HOME_CARD_COUNTDOWN_VALUE_CLASS_BY_SIZE,
  HOME_CARD_CROWN_ICON_SRC,
  HOME_CARD_CROWN_SIZE_PX,
  HOME_CARD_DEFAULT_COUNTDOWN,
  HOME_CARD_DEFAULT_IMAGE_SRC,
  HOME_CARD_MOBILE_CTA_TEXT_CLASS,
  HOME_CARD_MOBILE_WIDTH_PX,
  HOME_CARD_OFFER_SIZE_BY_CARD_SIZE,
  HOME_CARD_PREMIUM_OFFER_STACK_CLASS,
  HOME_CARD_SIGNUP_BADGE_CLASS,
  HOME_CARD_UNBLUR_CREATE_IMAGE_SRC,
  HOME_CARD_UNBLUR_CREATE_TINY_CTA_ICON_CLASS,
  HOME_CARD_UNBLUR_HEADER_CLASS,
  HOME_CARD_UNBLUR_ICON_SIZE_PX,
  HOME_CARD_UNBLUR_ICON_SRC,
  HOME_CARD_UNBLUR_LABEL_CLASS_BY_SIZE,
  HOME_CARD_UNBLUR_STACK_CLASS,
  HOME_CARD_VARIANT_CONFIG,
  type HomeCardCountdownUnit,
  type HomeCardSize,
  type HomeCardVariant,
  resolveHomeCardBackgroundImageWidth,
  resolveHomeCardButtonSize,
  resolveHomeCardContentClass,
  resolveHomeCardCtaClass,
  resolveHomeCardLayoutSize,
  resolveHomeCardRootClass,
  resolveHomeCardSizeClass,
} from "./home-cards.constants";

type HomeCardCountdownProps = {
  size?: HomeCardSize;
  units?: readonly HomeCardCountdownUnit[];
  className?: string;
};

function HomeCardCountdown({
  size = "desktop",
  units = HOME_CARD_DEFAULT_COUNTDOWN,
  className,
}: HomeCardCountdownProps) {
  const layoutSize = resolveHomeCardLayoutSize("buy-premium", size);
  const initialMs = resolveCountdownInitialMs(units, HOME_CARD_COUNTDOWN_INITIAL_MS);
  const { minutes, seconds, centiseconds } = useCountdown({
    initialMs,
    intervalMs: HOME_CARD_COUNTDOWN_TICK_INTERVAL_MS,
  });

  const liveUnits = [
    { value: minutes, label: "MIN" },
    { value: seconds, label: "SEC" },
    { value: centiseconds, label: "MS" },
  ] as const;

  return (
    <div
      data-slot="home-card-countdown"
      className={cn(HOME_CARD_COUNTDOWN_ROW_CLASS_BY_SIZE[layoutSize], className)}
    >
      {liveUnits.map((unit) => (
        <div key={unit.label} className={HOME_CARD_COUNTDOWN_UNIT_CLASS_BY_SIZE[layoutSize]}>
          <span className={HOME_CARD_COUNTDOWN_VALUE_CLASS_BY_SIZE[layoutSize]}>{unit.value}</span>
          <span className={HOME_CARD_COUNTDOWN_LABEL_CLASS_BY_SIZE[layoutSize]}>{unit.label}</span>
        </div>
      ))}
    </div>
  );
}

type HomeCardOfferArtProps = {
  size?: HomeCardSize;
};

function HomeCardOfferArt({ size = "desktop" }: HomeCardOfferArtProps) {
  const gradientId = React.useId().replace(/:/g, "");
  const layoutSize = resolveHomeCardLayoutSize("buy-premium", size);
  const { width, height } = HOME_CARD_OFFER_SIZE_BY_CARD_SIZE[layoutSize];

  return (
    <svg
      data-slot="home-card-offer"
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox="0 0 180 40"
      fill="none"
      className="shrink-0"
      aria-hidden
    >
      <path
        d="M3.35648 39.0774L17.9379 8.7202H0V0.490511H28.1174V6.92166L13.3159 39.0774H3.35648Z"
        fill={`url(#paint0_linear_${gradientId})`}
      />
      <path
        d="M45.2669 39.4589C43.3961 39.4589 41.6536 39.2227 40.0396 38.7504C38.4256 38.278 36.9949 37.5514 35.7477 36.5703C34.5005 35.553 33.455 34.2631 32.6113 32.7008C31.8043 31.1384 31.2724 29.3035 31.0156 27.1961H39.7095C39.8929 27.7775 40.223 28.3952 40.6999 29.0492C41.1768 29.7032 41.8187 30.23 42.6257 30.6297C43.4694 31.0294 44.4782 31.2292 45.6521 31.2292C46.936 31.2292 47.9631 31.0112 48.7334 30.5752C49.5404 30.1029 50.1457 29.4852 50.5492 28.7222C50.9527 27.9228 51.1545 27.069 51.1545 26.1606C51.1545 24.5982 50.6593 23.3265 49.6688 22.3455C48.6784 21.3282 47.2111 20.8195 45.2669 20.8195C44.1664 20.8195 43.1393 21.0193 42.1855 21.419C41.2318 21.7823 40.2964 22.291 39.3793 22.945H32.0611L32.4463 0.490511H58.8029V8.5567H40.865L40.6449 14.9333C41.8187 14.2067 43.121 13.7161 44.5516 13.4618C45.9822 13.2075 47.3211 13.0985 48.5684 13.1348C51.0995 13.2438 53.2271 13.8251 54.9512 14.8788C56.6753 15.8962 57.9775 17.3132 58.8579 19.1299C59.7383 20.9103 60.1785 23.0177 60.1785 25.4521C60.1785 28.4678 59.5182 31.0294 58.1976 33.1368C56.9137 35.2441 55.1346 36.8247 52.8602 37.8784C50.6226 38.9321 48.0915 39.4589 45.2669 39.4589Z"
        fill={`url(#paint1_linear_${gradientId})`}
      />
      <path
        d="M69.987 39.0774L95.7934 0.490511H104.762L79.121 39.0774H69.987ZM100.36 39.5134C98.4529 39.5134 96.7471 39.1137 95.2431 38.3144C93.7758 37.515 92.6019 36.3887 91.7216 34.9353C90.8779 33.4456 90.456 31.7016 90.456 29.7032C90.456 27.7048 90.8962 25.9608 91.7766 24.4711C92.657 22.9814 93.8492 21.8368 95.3532 21.0375C96.8572 20.2381 98.5813 19.8385 100.525 19.8385C102.396 19.8385 104.047 20.2381 105.478 21.0375C106.945 21.8005 108.1 22.9087 108.944 24.3621C109.788 25.7791 110.21 27.5231 110.21 29.5942C110.21 31.6652 109.77 33.4456 108.889 34.9353C108.045 36.3887 106.872 37.515 105.368 38.3144C103.9 39.1137 102.231 39.5134 100.36 39.5134ZM100.36 33.1368C101.131 33.1368 101.754 32.9733 102.231 32.6462C102.745 32.3192 103.112 31.9014 103.332 31.3927C103.552 30.884 103.662 30.339 103.662 29.7577C103.662 29.1763 103.533 28.6313 103.277 28.1226C103.057 27.614 102.708 27.1961 102.231 26.8691C101.754 26.5058 101.131 26.3241 100.36 26.3241C99.1498 26.3241 98.2694 26.6874 97.7192 27.4141C97.169 28.1408 96.9122 28.9583 96.9489 29.8667C96.9855 30.7024 97.2607 31.4654 97.7742 32.1557C98.3245 32.8098 99.1865 33.1368 100.36 33.1368ZM74.499 19.675C72.5548 19.675 70.849 19.2753 69.3817 18.4759C67.9144 17.6766 66.7589 16.5502 65.9152 15.0968C65.0715 13.6071 64.6496 11.8813 64.6496 9.91923C64.6496 7.88451 65.0715 6.12231 65.9152 4.63261C66.7956 3.1429 67.9878 1.99838 69.4918 1.19903C70.9958 0.399675 72.7015 0 74.609 0C76.5165 0 78.1856 0.399675 79.6162 1.19903C81.0835 1.96204 82.2207 3.07024 83.0277 4.5236C83.8714 5.94064 84.2933 7.68468 84.2933 9.75572C84.2933 11.7904 83.8714 13.5526 83.0277 15.0423C82.184 16.532 81.0285 17.6766 79.5612 18.4759C78.0939 19.2753 76.4065 19.675 74.499 19.675ZM74.499 13.2438C75.2693 13.2438 75.8929 13.0985 76.3698 12.8078C76.8834 12.4808 77.2502 12.0629 77.4703 11.5543C77.6904 11.0093 77.8004 10.4461 77.8004 9.86473C77.8004 9.31971 77.672 8.79287 77.4152 8.28419C77.1951 7.73918 76.8467 7.30317 76.3698 6.97616C75.8929 6.64915 75.2693 6.48565 74.499 6.48565C73.2884 6.48565 72.408 6.84899 71.8578 7.57567C71.3076 8.30236 71.0508 9.10171 71.0875 9.97373C71.1241 10.8094 71.3993 11.5724 71.9128 12.2628C72.4631 12.9168 73.3251 13.2438 74.499 13.2438Z"
        fill={`url(#paint2_linear_${gradientId})`}
      />
      <path
        d="M130.295 39.3265C128.011 39.3265 126.03 38.8594 124.353 37.9251C122.697 36.97 121.418 35.6516 120.517 33.9699C119.615 32.2673 119.165 30.3053 119.165 28.0837C119.165 25.7999 119.626 23.817 120.548 22.1353C121.492 20.4328 122.802 19.1144 124.479 18.1801C126.155 17.225 128.136 16.7475 130.421 16.7475C132.664 16.7475 134.614 17.2146 136.269 18.1489C137.946 19.0832 139.246 20.3913 140.168 22.073C141.112 23.734 141.583 25.696 141.583 27.9591C141.583 30.1807 141.122 32.1531 140.2 33.8764C139.277 35.5789 137.967 36.9181 136.269 37.8939C134.593 38.849 132.601 39.3265 130.295 39.3265ZM130.39 34.5616C131.815 34.5616 132.968 34.2398 133.848 33.5961C134.729 32.9525 135.368 32.1324 135.766 31.1358C136.165 30.1392 136.364 29.1218 136.364 28.0837C136.364 27.3155 136.249 26.5473 136.018 25.7791C135.808 25.0109 135.462 24.305 134.98 23.6613C134.519 23.0177 133.911 22.4986 133.157 22.1042C132.402 21.7097 131.469 21.5124 130.358 21.5124C128.954 21.5124 127.811 21.8342 126.931 22.4779C126.051 23.1007 125.401 23.9105 124.982 24.9071C124.583 25.9037 124.384 26.9522 124.384 28.0526C124.384 29.153 124.594 30.2015 125.013 31.1981C125.432 32.1947 126.082 33.0044 126.963 33.6273C127.864 34.2501 129.006 34.5616 130.39 34.5616Z"
        fill="#E5E5E5"
      />
      <path
        d="M144.833 39.0774V17.0277H160.963V21.6993H149.926V26.5888H159.17V31.1981H149.926V39.0774H144.833Z"
        fill="#E5E5E5"
      />
      <path
        d="M163.87 39.0774V17.0277H180V21.6993H168.964V26.5888H178.208V31.1981H168.964V39.0774H163.87Z"
        fill="#E5E5E5"
      />
      <defs>
        <linearGradient
          id={`paint0_linear_${gradientId}`}
          x1="90"
          y1="0"
          x2="90"
          y2="39.5134"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#FCC738" />
          <stop offset="0.2" stopColor="#FDAF1C" />
          <stop offset="1" stopColor="#D77B08" />
        </linearGradient>
        <linearGradient
          id={`paint1_linear_${gradientId}`}
          x1="90"
          y1="0"
          x2="90"
          y2="39.5134"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#FCC738" />
          <stop offset="0.2" stopColor="#FDAF1C" />
          <stop offset="1" stopColor="#D77B08" />
        </linearGradient>
        <linearGradient
          id={`paint2_linear_${gradientId}`}
          x1="90"
          y1="0"
          x2="90"
          y2="39.5134"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#FCC738" />
          <stop offset="0.2" stopColor="#FDAF1C" />
          <stop offset="1" stopColor="#D77B08" />
        </linearGradient>
      </defs>
    </svg>
  );
}

type HomeCardBackgroundProps = {
  variant: HomeCardVariant;
  size: HomeCardSize;
  imageSrc: string;
  imageAlt: string;
  imageOverride?: boolean;
};

function HomeCardBackground({
  variant,
  size,
  imageSrc,
  imageAlt,
  imageOverride,
}: HomeCardBackgroundProps) {
  const config = HOME_CARD_VARIANT_CONFIG[variant];

  if (config.background === "premium-gradient" && !imageOverride) {
    return (
      <div data-slot="home-card-background" className="absolute inset-0">
        <div
          className="absolute inset-0"
          style={{ background: "var(--buy-premium-gradient)" }}
          aria-hidden
        />
        <GradientGrid className="h-full w-full opacity-35" minOpacity={0.35} maxOpacity={0.55} />
      </div>
    );
  }

  return (
    <div data-slot="home-card-background" className="absolute inset-0">
      <Image
        src={imageSrc}
        alt={imageAlt}
        fill
        sizes={`(max-width: 767px) ${HOME_CARD_MOBILE_WIDTH_PX}px, ${resolveHomeCardBackgroundImageWidth(variant, size)}px`}
        className={cn("object-cover", config.background === "image-blur" && "scale-110 blur-xl")}
        priority
      />
      {config.background === "image-blur" ? (
        <div className="absolute inset-0 bg-black/35" aria-hidden />
      ) : null}
    </div>
  );
}

export type HomeCardProps = Omit<React.ComponentProps<"article">, "children"> & {
  variant?: HomeCardVariant;
  size?: HomeCardSize;
  /** Logical asset key, re-resolved live via `useAsset`. See `CharacterHighlight`. */
  assetKey?: string;
  showCta?: boolean;
  imageBackground?: boolean;
  imageSrc?: string;
  imageAlt?: string;
  countdownUnits?: readonly HomeCardCountdownUnit[];
  signupCount?: string | number;
  onCtaClick?: React.ComponentProps<typeof Buttons>["onClick"];
};

export function HomeCard({
  variant = "buy-premium",
  size = "desktop",
  assetKey,
  showCta = true,
  imageBackground = false,
  imageSrc,
  imageAlt = "Home card preview",
  countdownUnits = HOME_CARD_DEFAULT_COUNTDOWN,
  signupCount = "+30",
  onCtaClick,
  onClick,
  className,
  ...props
}: HomeCardProps) {
  const fallbackImageSrc =
    variant === "unblur--create" ? HOME_CARD_UNBLUR_CREATE_IMAGE_SRC : HOME_CARD_DEFAULT_IMAGE_SRC;
  const resolvedImageSrc = useAssetImage(assetKey ?? "", imageSrc ?? fallbackImageSrc);
  const config = HOME_CARD_VARIANT_CONFIG[variant];
  const layoutSize = resolveHomeCardLayoutSize(variant, size);
  const isCompactLayout = layoutSize === "mobile";
  const isCreateTiny = variant === "unblur--create" && size === "tiny";
  const isPremiumFullButton = config.buttonVariant === "premium-full";
  const buttonSize = resolveHomeCardButtonSize(variant, size, config.buttonSize);
  const contentClass = resolveHomeCardContentClass(variant, size);
  const crownSize = HOME_CARD_CROWN_SIZE_PX[layoutSize];
  const unblurIconSize = HOME_CARD_UNBLUR_ICON_SIZE_PX[layoutSize];
  const hasUnblurStack = config.showUnblurIcon && Boolean(config.unblurLabel);
  const hasPremiumOfferStack = config.showCrown || Boolean(config.offerText);
  // FRONT-680: the Create my AI card and its CTA share one destination. Card
  // clicks use the CTA handler when the host did not pass a separate onClick.
  const createClickHandler = variant === "unblur--create" ? (onClick ?? onCtaClick) : undefined;

  const handleArticleClick: React.MouseEventHandler<HTMLElement> | undefined = createClickHandler
    ? (event) => {
        createClickHandler(event as React.MouseEvent<HTMLButtonElement>);
      }
    : onClick;

  const handleCtaClick: React.ComponentProps<typeof Buttons>["onClick"] = createClickHandler
    ? (event) => {
        event.stopPropagation();
        createClickHandler(event);
      }
    : onCtaClick;

  const ctaButton = showCta ? (
    <Buttons
      data-slot="home-card-cta"
      type="button"
      variant={config.buttonVariant}
      size={buttonSize}
      label={config.ctaLabel}
      leftIcon={config.showMagicPen}
      rightIcon={false}
      iconSrc={isPremiumFullButton ? "/assets/question.svg" : undefined}
      leftIconSrc={config.showMagicPen ? "/assets/icons/magic-pen.svg" : undefined}
      leftIconSizeClassName={isCreateTiny ? HOME_CARD_UNBLUR_CREATE_TINY_CTA_ICON_CLASS : "h-5 w-5"}
      className={cn(
        resolveHomeCardCtaClass(variant, size, buttonSize),
        isCompactLayout && HOME_CARD_MOBILE_CTA_TEXT_CLASS,
        isCompactLayout &&
          (variant === "buy-premium" || variant === "unblur--premium") &&
          "text-sm!",
      )}
      onClick={handleCtaClick}
    >
      {config.showSignupBadge ? (
        <Badge
          className={HOME_CARD_SIGNUP_BADGE_CLASS}
          text={signupCount}
          type="empty"
          size="small"
        />
      ) : null}
    </Buttons>
  ) : null;

  return (
    <article
      data-slot="home-card"
      data-variant={variant}
      data-size={size}
      className={cn(
        resolveHomeCardRootClass(variant, size),
        resolveHomeCardSizeClass(variant, size),
        createClickHandler && "cursor-pointer",
        className,
      )}
      onClick={handleArticleClick}
      {...props}
    >
      <HomeCardBackground
        variant={variant}
        size={size}
        imageSrc={resolvedImageSrc}
        imageAlt={imageAlt}
        imageOverride={imageBackground}
      />

      <div data-slot="home-card-content" className={contentClass}>
        {config.showCountdown ? (
          <HomeCardCountdown size={layoutSize} units={countdownUnits} />
        ) : null}

        {hasPremiumOfferStack ? (
          <div
            data-slot="home-card-premium-offer-stack"
            className={HOME_CARD_PREMIUM_OFFER_STACK_CLASS}
          >
            {config.showCrown ? (
              <Image
                src={HOME_CARD_CROWN_ICON_SRC}
                alt=""
                width={crownSize}
                height={crownSize}
                aria-hidden
                className="shrink-0"
              />
            ) : null}
            {config.offerText ? <HomeCardOfferArt size={layoutSize} /> : null}
          </div>
        ) : null}

        {hasUnblurStack ? (
          <div data-slot="home-card-unblur-stack" className={HOME_CARD_UNBLUR_STACK_CLASS}>
            <div data-slot="home-card-unblur-header" className={HOME_CARD_UNBLUR_HEADER_CLASS}>
              <Image
                src={HOME_CARD_UNBLUR_ICON_SRC}
                alt=""
                width={unblurIconSize}
                height={unblurIconSize}
                aria-hidden
                className="shrink-0"
              />
              <p
                data-slot="home-card-unblur-label"
                className={HOME_CARD_UNBLUR_LABEL_CLASS_BY_SIZE[layoutSize]}
              >
                {config.unblurLabel}
              </p>
            </div>
            {ctaButton}
          </div>
        ) : (
          ctaButton
        )}
      </div>
    </article>
  );
}

export type HomeCardsProps = React.ComponentProps<"div"> & {
  cards?: HomeCardProps[];
};

export function HomeCards({ cards, className, ...props }: HomeCardsProps) {
  if (!cards?.length) return null;

  return (
    <div
      data-slot="home-cards"
      className={cn("flex flex-wrap items-start justify-center gap-4", className)}
      {...props}
    >
      {cards.map((card, index) => (
        <HomeCard key={`${card.variant ?? "card"}-${card.size ?? "desktop"}-${index}`} {...card} />
      ))}
    </div>
  );
}
