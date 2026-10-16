"use client";

import Image from "next/image";
import * as React from "react";
import { createPortal } from "react-dom";

import { Alert } from "@/components/common/general/alert/alert";
import { BankButton } from "@/components/common/general/bank-button/bank-button";
import { Buttons } from "@/components/common/general/button/buttons";
import { Divider } from "@/components/common/general/divider/divider";
import {
  RadioButton,
  RadioButtonGroup,
} from "@/components/common/general/radio-button/radio-button";
import { Spinner } from "@/components/common/general/spinner";
import { State } from "@/components/common/general/state/state";
import { TextInput } from "@/components/common/general/text-input/text-input";
import { type PerkItem } from "@/components/common/membership/perk-list/perk-list";
import { BackNav } from "@/components/common/payment-gateway/back-navigation/back-nav";
import {
  ProductCard,
  ProductCardGroup,
} from "@/components/common/payment-gateway/product-card/product-card";
import { formatCountdownClock, useCountdown } from "@/hooks/use-countdown";
import { useIsDesktop } from "@/hooks/use-is-desktop";
import { useIsHydrated } from "@/hooks/use-is-hydrated";
import { DUMMY_REQUIRES_ACTION_ENABLED } from "@/lib/feature-flags";
import { formatCents } from "@/lib/money";
import { dummyTokenForCardNumber } from "@/lib/payments/dummy-card-tokens";
import { cn } from "@/lib/utils";
import { ClockIcon } from "@/public/assets/icons";

import {
  formatPayEmptyMonthlySuccessRedirectText,
  PAY_EMPTY_MONTHLY_ALERT_TEXT,
  PAY_EMPTY_MONTHLY_ASSETS,
  PAY_EMPTY_MONTHLY_CARD_LABEL,
  PAY_EMPTY_MONTHLY_CARD_NUMBER_PLACEHOLDER,
  PAY_EMPTY_MONTHLY_CARDHOLDER_LABEL,
  PAY_EMPTY_MONTHLY_CARDHOLDER_PLACEHOLDER,
  PAY_EMPTY_MONTHLY_COMPANY_ADDRESS,
  PAY_EMPTY_MONTHLY_CVC_PLACEHOLDER,
  PAY_EMPTY_MONTHLY_DIFFERENT_METHOD_CTA,
  PAY_EMPTY_MONTHLY_EXPIRY_PLACEHOLDER,
  PAY_EMPTY_MONTHLY_FAILURE_TITLE,
  PAY_EMPTY_MONTHLY_LOADING_FORM_TEXT,
  PAY_EMPTY_MONTHLY_POWERED_BY,
  PAY_EMPTY_MONTHLY_PROCESSING_LABEL,
  PAY_EMPTY_MONTHLY_REMEMBERED_SUBTITLE,
  PAY_EMPTY_MONTHLY_REMEMBERED_TITLE,
  PAY_EMPTY_MONTHLY_SAVED_CARD_DEFAULT_ID,
  PAY_EMPTY_MONTHLY_SAVED_CARDS,
  PAY_EMPTY_MONTHLY_SUCCESS_CTA,
  PAY_EMPTY_MONTHLY_SUCCESS_REDIRECT_MS,
  PAY_EMPTY_MONTHLY_SUCCESS_TITLE,
  PAY_EMPTY_MONTHLY_TIMEOUT_ALERT_TEXT,
  PAY_EMPTY_MONTHLY_TIMEOUT_MS,
  PAY_EMPTY_MONTHLY_TOKEN_PACK,
  PAY_EMPTY_MONTHLY_TOKENS,
  PAY_EMPTY_MONTHLY_TOTAL_DUE_LABEL,
} from "./pay-empty-monthly.constants";

const DESKTOP_BREAKPOINT_PX = 1024;
const BANK_BUTTON_CLASSNAME = "w-full max-w-none min-h-11";
const LIGHT_METHOD_BUTTON_CLASSNAME = "h-11! w-full max-w-none";
const WALLET_BUTTON_CLASSNAME =
  "h-11! w-full max-w-none min-w-0 lg:w-auto! lg:max-w-[246px] lg:flex-1 lg:basis-0";

export type PayEmptyMonthlyCartState = "subscription" | "subscription-tokens" | "tokens";
export type PayEmptyMonthlyInputState =
  | "default"
  | "loading"
  | "processing"
  | "success"
  | "failed"
  | "timeout"
  | "remembered";

export type PayEmptyMonthlyProduct = {
  name: string;
  interval: "monthly" | "quarterly" | "yearly";
  priceCents: number;
  compareAtCents: number | null;
  currency: string;
  coinGrant: number;
  perks: PerkItem[];
  discountLabel?: string;
};

export type PayEmptyMonthlyProps = {
  open?: boolean;
  onBack?: () => void;
  onPay?: (token: string) => void;
  onStartCreating?: () => void;
  payLabel?: string;
  className?: string;
  /** When true, render in a full-viewport portal over app chrome. Default true when `open` is set. */
  portal?: boolean;
  /** Subscription-only is default; subscription + tokens and tokens-only are separate carts. */
  cartState?: PayEmptyMonthlyCartState;
  /** Card fields are default; loading replaces them with the spinner; processing disables Pay; timeout hides card pay; remembered shows saved cards. */
  inputState?: PayEmptyMonthlyInputState;
  product: PayEmptyMonthlyProduct;
  failureMessage?: string;
  notice?: { kind: "info" | "error"; message: string; actionLabel?: string; onAction?: () => void };
  paymentDisabled?: boolean;
};

function intervalTitle(interval: PayEmptyMonthlyProduct["interval"]): string {
  return interval === "monthly" ? "Monthly" : interval === "quarterly" ? "Quarterly" : "Yearly";
}

function intervalDuration(interval: PayEmptyMonthlyProduct["interval"]): string {
  return interval === "monthly" ? "1 MONTH" : interval === "quarterly" ? "3 MONTHS" : "1 YEAR";
}

function PayEmptyMonthlySubscriptionCard({
  product,
  framed = true,
}: {
  product: PayEmptyMonthlyProduct;
  framed?: boolean;
}) {
  return (
    <ProductCard
      variant={product.compareAtCents == null ? "default" : "discount"}
      title={`${product.name} ${intervalTitle(product.interval)}`}
      subtitle="Recurring Payment"
      price={product.priceCents}
      currency={product.currency}
      originalPrice={product.compareAtCents ?? undefined}
      discountLabel={product.discountLabel}
      badge={product.name.toUpperCase()}
      duration={intervalDuration(product.interval)}
      framed={framed}
      className="w-full"
    />
  );
}

function PayEmptyMonthlyTokensCard({ framed = true }: { framed?: boolean }) {
  return (
    <ProductCard
      variant="default"
      title={PAY_EMPTY_MONTHLY_TOKENS.title}
      subtitle={PAY_EMPTY_MONTHLY_TOKENS.subtitle}
      price={PAY_EMPTY_MONTHLY_TOKENS.price}
      currency="USD"
      badge={PAY_EMPTY_MONTHLY_TOKENS.badge}
      duration={PAY_EMPTY_MONTHLY_TOKENS.tokenAmount}
      thumbnailVariant="tokens"
      showThumbnailIcon
      framed={framed}
      className="w-full"
    />
  );
}

function PayEmptyMonthlyTokenPackCard() {
  return (
    <ProductCard
      variant="discount"
      title={PAY_EMPTY_MONTHLY_TOKEN_PACK.title}
      subtitle={PAY_EMPTY_MONTHLY_TOKEN_PACK.subtitle}
      price={PAY_EMPTY_MONTHLY_TOKEN_PACK.price}
      currency="USD"
      originalPrice={PAY_EMPTY_MONTHLY_TOKEN_PACK.originalPrice}
      discountLabel={PAY_EMPTY_MONTHLY_TOKEN_PACK.discountLabel}
      badge={PAY_EMPTY_MONTHLY_TOKEN_PACK.badge}
      duration={PAY_EMPTY_MONTHLY_TOKEN_PACK.tokenAmount}
      thumbnailVariant="tokens"
      showThumbnailIcon
      className="w-full"
    />
  );
}

function PayEmptyMonthlyProducts({
  cartState,
  product,
}: {
  cartState: PayEmptyMonthlyCartState;
  product: PayEmptyMonthlyProduct;
}) {
  if (cartState === "tokens") {
    return <PayEmptyMonthlyTokenPackCard />;
  }

  if (cartState === "subscription-tokens") {
    return (
      <ProductCardGroup
        totalCents={cartTotalCents(cartState, product)}
        currency={product.currency}
        totalLabel={PAY_EMPTY_MONTHLY_TOTAL_DUE_LABEL}
      >
        <PayEmptyMonthlySubscriptionCard product={product} framed={false} />
        <PayEmptyMonthlyTokensCard framed={false} />
      </ProductCardGroup>
    );
  }

  return <PayEmptyMonthlySubscriptionCard product={product} />;
}

function cartTotalCents(cartState: PayEmptyMonthlyCartState, product: PayEmptyMonthlyProduct) {
  if (cartState === "subscription-tokens") {
    return product.priceCents + PAY_EMPTY_MONTHLY_TOKENS.price;
  }

  return product.priceCents;
}

function resolvePayCopy(
  cartState: PayEmptyMonthlyCartState,
  product: PayEmptyMonthlyProduct,
  payLabel?: string,
) {
  return {
    payLabel:
      payLabel ?? `Pay ${formatCents(cartTotalCents(cartState, product), product.currency)}`,
  };
}

function WalletPayButton({
  label,
  markSrc,
  markWidth,
  onClick,
}: {
  label: string;
  markSrc: string;
  markWidth: number;
  onClick?: () => void;
}) {
  return (
    <Buttons
      variant="light-grey"
      size="btn-m"
      label=""
      leftIcon={false}
      rightIcon={false}
      aria-label={label}
      className={WALLET_BUTTON_CLASSNAME}
      onClick={onClick}
    >
      <Image src={markSrc} alt="" width={markWidth} height={16} className="h-4 w-auto" />
    </Buttons>
  );
}

function PayEmptyMonthlyMethods() {
  return (
    <div className="flex w-full flex-col gap-2">
      <div className="flex w-full max-w-[500px] flex-col gap-2 lg:flex-row">
        <WalletPayButton
          label="Apple Pay"
          markSrc={PAY_EMPTY_MONTHLY_ASSETS.applePayMark}
          markWidth={36}
        />
        <WalletPayButton
          label="Google Pay"
          markSrc={PAY_EMPTY_MONTHLY_ASSETS.googlePayMark}
          markWidth={40}
        />
      </div>

      <BankButton kind="bank" label="By Bank" countText="+99" className={BANK_BUTTON_CLASSNAME} />
      <Buttons
        variant="light-grey"
        size="btn-m"
        label="Ideal"
        leftIcon={false}
        rightIcon
        rightIconSrc={PAY_EMPTY_MONTHLY_ASSETS.ideal}
        className={cn(LIGHT_METHOD_BUTTON_CLASSNAME, "hidden")}
      />
      <BankButton
        kind="crypto"
        label="Crypto"
        showBadge={false}
        logos={PAY_EMPTY_MONTHLY_ASSETS.cryptoMarks}
        className={BANK_BUTTON_CLASSNAME}
      />
    </div>
  );
}

function PayEmptyMonthlyCardFields({
  cardNumber,
  onCardNumberChange,
}: {
  cardNumber: string;
  onCardNumberChange: (value: string) => void;
}) {
  return (
    <>
      <div className="flex w-full flex-col gap-2">
        <div className="flex items-center justify-between gap-2">
          <p className="text-sm leading-5 font-medium">{PAY_EMPTY_MONTHLY_CARD_LABEL}</p>
          <Image
            src={PAY_EMPTY_MONTHLY_ASSETS.cardBrands}
            alt=""
            width={52}
            height={16}
            className="h-4 w-auto"
          />
        </div>
        <TextInput
          showLeftIcon={false}
          placeholder={PAY_EMPTY_MONTHLY_CARD_NUMBER_PLACEHOLDER}
          inputMode="numeric"
          autoComplete="cc-number"
          className="w-full"
          aria-label={PAY_EMPTY_MONTHLY_CARD_LABEL}
          value={cardNumber}
          onChange={(event) => onCardNumberChange(event.target.value)}
        />
        {/* Expiry, CVC, and cardholder name are presentational while the dummy
            provider is active. They are deliberately never read or sent. */}
        <div className="flex items-center gap-2">
          <TextInput
            showLeftIcon={false}
            placeholder={PAY_EMPTY_MONTHLY_EXPIRY_PLACEHOLDER}
            autoComplete="cc-exp"
            className="w-full"
            aria-label="Expiry date"
          />
          <TextInput
            showLeftIcon={false}
            placeholder={PAY_EMPTY_MONTHLY_CVC_PLACEHOLDER}
            autoComplete="cc-csc"
            className="w-full"
            aria-label="CVC"
          />
        </div>
      </div>

      <div className="flex w-full flex-col gap-2">
        <p className="text-sm leading-5 font-medium">{PAY_EMPTY_MONTHLY_CARDHOLDER_LABEL}</p>
        <TextInput
          showLeftIcon={false}
          placeholder={PAY_EMPTY_MONTHLY_CARDHOLDER_PLACEHOLDER}
          autoComplete="cc-name"
          className="w-full"
          aria-label={PAY_EMPTY_MONTHLY_CARDHOLDER_LABEL}
        />
      </div>
    </>
  );
}

function PayEmptyMonthlyLoadingForm() {
  return (
    <div
      data-slot="pay-empty-monthly-loading-form"
      className="flex h-[210px] w-full items-center justify-center gap-1.5 rounded-2xl bg-[#171717]"
      aria-busy="true"
      aria-live="polite"
    >
      <Spinner className="size-4" aria-label="Loading payment form" />
      <p className="text-sm leading-5 font-normal text-[#525252]">
        {PAY_EMPTY_MONTHLY_LOADING_FORM_TEXT}
      </p>
    </div>
  );
}

function PayEmptyMonthlyTimeoutAlert() {
  const { totalSeconds } = useCountdown({ initialMs: PAY_EMPTY_MONTHLY_TIMEOUT_MS });
  const text = PAY_EMPTY_MONTHLY_TIMEOUT_ALERT_TEXT.replace(
    "{time}",
    formatCountdownClock(totalSeconds),
  );

  return (
    <Alert
      type="alert"
      text={text}
      iconSrc={PAY_EMPTY_MONTHLY_ASSETS.warningIcon}
      iconAlt="Warning"
    />
  );
}

function PayEmptyMonthlyFailureBanner({
  message = PAY_EMPTY_MONTHLY_FAILURE_TITLE,
}: {
  message?: string;
}) {
  return (
    <div
      data-slot="pay-empty-monthly-failure"
      role="alert"
      className="flex w-full max-w-[500px] flex-col items-center gap-2 pb-4"
    >
      <State status="error" />
      <p className="text-center text-[18px] leading-7 font-medium">{message}</p>
    </div>
  );
}

function PayEmptyMonthlyNotice({
  notice,
}: {
  notice: NonNullable<PayEmptyMonthlyProps["notice"]>;
}) {
  return (
    <div
      role={notice.kind === "error" ? "alert" : "status"}
      className="border-border-strong bg-tooltip-default-bg flex w-full max-w-[500px] flex-col gap-3 rounded-2xl border p-4 text-center"
    >
      <p className="text-sm leading-5">{notice.message}</p>
      {notice.actionLabel && notice.onAction ? (
        <Buttons
          type="button"
          variant="neutral-border"
          size="btn-s"
          label={notice.actionLabel}
          leftIcon={false}
          rightIcon={false}
          onClick={notice.onAction}
          className="self-center"
        />
      ) : null}
    </div>
  );
}

function PayEmptyMonthlyStartCreatingButton({ onStartCreating }: { onStartCreating?: () => void }) {
  return (
    <Buttons
      variant="rose"
      size="btn-m"
      label={PAY_EMPTY_MONTHLY_SUCCESS_CTA}
      leftIcon={false}
      rightIcon={false}
      onClick={onStartCreating}
      className="h-11! w-full max-w-none"
    />
  );
}

function PayEmptyMonthlySuccessRedirect({
  redirectMs,
  onComplete,
  isDesktop,
}: {
  redirectMs: number;
  onComplete?: () => void;
  isDesktop: boolean;
}) {
  const { totalSeconds, isComplete } = useCountdown({ initialMs: redirectMs });
  const hasCompletedRef = React.useRef(false);

  React.useEffect(() => {
    if (!isComplete || hasCompletedRef.current) return;
    hasCompletedRef.current = true;
    onComplete?.();
  }, [isComplete, onComplete]);

  return (
    <div className="flex items-center justify-center gap-1">
      {isDesktop ? <ClockIcon className="size-4 text-[#A3A3A3]" aria-hidden /> : null}
      <p className="text-center text-sm leading-5 font-normal text-[#A3A3A3]">
        {formatPayEmptyMonthlySuccessRedirectText(totalSeconds)}
      </p>
    </div>
  );
}

function PayEmptyMonthlySuccess({
  cartState,
  product,
  onStartCreating,
  isDesktop,
}: {
  cartState: PayEmptyMonthlyCartState;
  product: PayEmptyMonthlyProduct;
  onStartCreating?: () => void;
  isDesktop: boolean;
}) {
  return (
    <div
      data-slot="pay-empty-monthly-success"
      className={cn(
        "text-tooltip-text flex min-h-full w-full items-center justify-center bg-[#0E0E0E]",
        isDesktop ? "p-8" : "px-4 pt-4 pb-[76px]",
      )}
    >
      <div className="flex w-full max-w-[500px] flex-col justify-center gap-4">
        <div className="flex w-full flex-col items-center gap-2 pb-4">
          <State status="success" />
          <p className="text-center text-[18px] leading-7 font-medium">
            {PAY_EMPTY_MONTHLY_SUCCESS_TITLE}
          </p>
        </div>

        <PayEmptyMonthlyProducts cartState={cartState} product={product} />

        <PayEmptyMonthlySuccessRedirect
          redirectMs={PAY_EMPTY_MONTHLY_SUCCESS_REDIRECT_MS}
          onComplete={onStartCreating}
          isDesktop={isDesktop}
        />

        {isDesktop ? (
          <PayEmptyMonthlyStartCreatingButton onStartCreating={onStartCreating} />
        ) : null}
      </div>
    </div>
  );
}

function PayEmptyMonthlyPayButton({
  label,
  onPay,
  className,
  isProcessing = false,
}: {
  label: string;
  onPay?: () => void;
  className?: string;
  isProcessing?: boolean;
}) {
  return (
    <Buttons
      variant="rose"
      size="btn-m"
      label={isProcessing ? PAY_EMPTY_MONTHLY_PROCESSING_LABEL : label}
      leftIcon
      rightIcon={false}
      leftIconSrc={isProcessing ? undefined : PAY_EMPTY_MONTHLY_ASSETS.cardIcon}
      leftIconNode={isProcessing ? <Spinner className="size-4" /> : undefined}
      disabled={isProcessing}
      aria-busy={isProcessing || undefined}
      onClick={onPay}
      className={cn("h-11! w-full max-w-none", className)}
    />
  );
}

function formatSavedCardLabel(brand: string, ending: string) {
  return `${brand} Ending with ${ending}`;
}

function PayEmptyMonthlyPoweredBy({ className }: { className?: string }) {
  return (
    <div className={cn("flex w-full max-w-[500px] flex-col items-center gap-0.5 pt-2", className)}>
      <p className="text-xs leading-[18px] font-normal">{PAY_EMPTY_MONTHLY_POWERED_BY}</p>
      <Image
        src={PAY_EMPTY_MONTHLY_ASSETS.poweredBy}
        alt="PayFirmly"
        width={95}
        height={23}
        className="h-[23px] w-[95px]"
      />
    </div>
  );
}

function PayEmptyMonthlyRemembered({
  payLabel,
  onPay,
  onUseDifferentMethod,
  isDesktop,
}: {
  payLabel: string;
  onPay?: () => void;
  onUseDifferentMethod: () => void;
  isDesktop: boolean;
}) {
  const [selectedCard, setSelectedCard] = React.useState(PAY_EMPTY_MONTHLY_SAVED_CARD_DEFAULT_ID);

  return (
    <div
      data-slot="pay-empty-monthly-remembered"
      className="flex w-full max-w-[500px] flex-col gap-4"
    >
      <div className="flex w-full flex-col">
        <p className="text-[18px] leading-7 font-medium">{PAY_EMPTY_MONTHLY_REMEMBERED_TITLE}</p>
        <p className="text-sm leading-5 font-normal">{PAY_EMPTY_MONTHLY_REMEMBERED_SUBTITLE}</p>
      </div>

      <RadioButtonGroup
        value={selectedCard}
        onValueChange={setSelectedCard}
        className="w-full gap-2"
        aria-label={PAY_EMPTY_MONTHLY_REMEMBERED_TITLE}
      >
        {PAY_EMPTY_MONTHLY_SAVED_CARDS.map((card) => (
          <RadioButton
            key={card.id}
            value={card.id}
            label={formatSavedCardLabel(card.brand, card.ending)}
            leftIcon={
              <Image
                src={PAY_EMPTY_MONTHLY_ASSETS.visa}
                alt=""
                width={20}
                height={13}
                className="h-[13px] w-5 shrink-0"
              />
            }
            className="w-full max-w-none"
          />
        ))}
      </RadioButtonGroup>

      {isDesktop ? <PayEmptyMonthlyPayButton label={payLabel} onPay={onPay} /> : null}

      <Divider />

      <Buttons
        variant="neutral"
        size="btn-m"
        label={PAY_EMPTY_MONTHLY_DIFFERENT_METHOD_CTA}
        leftIcon={false}
        rightIcon={false}
        onClick={onUseDifferentMethod}
        className="h-11! w-full max-w-none"
      />

      <PayEmptyMonthlyPoweredBy />
    </div>
  );
}

function PayEmptyMonthlyLayout({
  onBack,
  onPay,
  onRequiresAction,
  onStartCreating,
  payLabel,
  cartState,
  inputState,
  product,
  failureMessage,
  notice,
  paymentDisabled,
  cardNumber,
  onCardNumberChange,
  isDesktop,
}: Pick<
  PayEmptyMonthlyProps,
  | "onBack"
  | "onStartCreating"
  | "payLabel"
  | "cartState"
  | "inputState"
  | "product"
  | "failureMessage"
  | "notice"
  | "paymentDisabled"
> & {
  onPay?: () => void;
  onRequiresAction?: () => void;
  cartState: PayEmptyMonthlyCartState;
  inputState: PayEmptyMonthlyInputState;
  isDesktop: boolean;
  cardNumber: string;
  onCardNumberChange: (value: string) => void;
}) {
  const { payLabel: resolvedPayLabel } = resolvePayCopy(cartState, product, payLabel);
  const isLoadingForm = inputState === "loading";
  const isProcessing = inputState === "processing";
  const isCardTimeout = inputState === "timeout";
  const [useDifferentMethod, setUseDifferentMethod] = React.useState(false);
  const [useDifferentMethodInputState, setUseDifferentMethodInputState] =
    React.useState(inputState);
  const isRemembered = inputState === "remembered" && !useDifferentMethod;

  if (inputState !== useDifferentMethodInputState) {
    setUseDifferentMethodInputState(inputState);
    setUseDifferentMethod(false);
  }

  if (inputState === "success") {
    return (
      <PayEmptyMonthlySuccess
        cartState={cartState}
        product={product}
        onStartCreating={onStartCreating}
        isDesktop={isDesktop}
      />
    );
  }

  return (
    <div
      data-slot="pay-empty-monthly"
      className="text-tooltip-text grid min-h-full w-full grid-cols-1 bg-[#0E0E0E] lg:grid-cols-[minmax(0,1fr)_400px] lg:items-stretch"
    >
      <div
        className={cn(
          "flex min-h-full min-w-0 flex-col items-center gap-4 p-4 lg:p-8 lg:pb-8",
          isCardTimeout ? "pb-4" : "pb-[76px]",
        )}
      >
        <BackNav onBack={onBack} disabled={isProcessing} className="w-full shrink-0 self-stretch" />

        {inputState === "failed" ? <PayEmptyMonthlyFailureBanner message={failureMessage} /> : null}
        {notice ? <PayEmptyMonthlyNotice notice={notice} /> : null}

        {isDesktop ? null : <PayEmptyMonthlyProducts cartState={cartState} product={product} />}

        {isRemembered ? (
          <PayEmptyMonthlyRemembered
            payLabel={resolvedPayLabel}
            onPay={onPay}
            onUseDifferentMethod={() => setUseDifferentMethod(true)}
            isDesktop={isDesktop}
          />
        ) : (
          <div className="flex w-full max-w-[500px] flex-1 flex-col gap-4">
            <PayEmptyMonthlyMethods />

            <Divider />

            {isCardTimeout ? (
              <PayEmptyMonthlyTimeoutAlert />
            ) : (
              <Alert
                type="alert"
                text={PAY_EMPTY_MONTHLY_ALERT_TEXT}
                iconSrc={PAY_EMPTY_MONTHLY_ASSETS.alertIcon}
                iconAlt="Info"
              />
            )}

            {isCardTimeout ? null : isLoadingForm ? (
              <PayEmptyMonthlyLoadingForm />
            ) : (
              <PayEmptyMonthlyCardFields
                cardNumber={cardNumber}
                onCardNumberChange={onCardNumberChange}
              />
            )}

            {DUMMY_REQUIRES_ACTION_ENABLED && !isCardTimeout ? (
              <div className="border-feedback-error flex flex-col gap-2 rounded-2xl border p-3 text-xs">
                <p>
                  This creates an unresolved payment that blocks account deletion. Recovery requires
                  the brand-wide dummy-payment purge or a database reset.
                </p>
                <Buttons
                  type="button"
                  variant="neutral-border"
                  size="btn-s"
                  label="Test required action"
                  leftIcon={false}
                  rightIcon={false}
                  onClick={onRequiresAction}
                />
              </div>
            ) : null}

            {isDesktop && !isCardTimeout && !paymentDisabled ? (
              <PayEmptyMonthlyPayButton
                label={resolvedPayLabel}
                onPay={onPay}
                isProcessing={isProcessing}
              />
            ) : null}

            <p className="text-center text-xs leading-4 font-normal text-[#737373]">
              {PAY_EMPTY_MONTHLY_COMPANY_ADDRESS}
            </p>
          </div>
        )}

        {isRemembered ? null : <PayEmptyMonthlyPoweredBy className="lg:mt-auto" />}
      </div>

      {isDesktop ? (
        <aside className="flex min-h-full flex-col gap-4 border-[#262626] bg-[linear-gradient(180deg,#0A0A0A_0%,#171717_100%)] p-8 lg:border-l">
          <PayEmptyMonthlyRecap cartState={cartState} product={product} />
        </aside>
      ) : null}
    </div>
  );
}

function PayEmptyMonthlyRecap({
  cartState,
  product,
}: {
  cartState: PayEmptyMonthlyCartState;
  product: PayEmptyMonthlyProduct;
}) {
  return <PayEmptyMonthlyProducts cartState={cartState} product={product} />;
}

function PayEmptyMonthlyStickyFooter({
  children,
  slot,
  opaque = false,
}: {
  children: React.ReactNode;
  slot?: string;
  opaque?: boolean;
}) {
  return (
    <div
      data-slot={slot}
      className={cn(
        "pointer-events-none absolute inset-x-0 bottom-0 z-10 p-4 lg:hidden",
        opaque ? "bg-[#0E0E0E]" : "bg-[linear-gradient(180deg,rgba(0,0,0,0)_0%,#000_71%)]",
      )}
    >
      <div className="pointer-events-auto">{children}</div>
    </div>
  );
}

function PayEmptyMonthlyStickyPay({
  payLabel,
  onPay,
  isProcessing,
}: {
  payLabel: string;
  onPay?: () => void;
  isProcessing?: boolean;
}) {
  return (
    <PayEmptyMonthlyStickyFooter slot="pay-empty-monthly-sticky-pay" opaque={isProcessing}>
      <PayEmptyMonthlyPayButton label={payLabel} onPay={onPay} isProcessing={isProcessing} />
    </PayEmptyMonthlyStickyFooter>
  );
}

function PayEmptyMonthlyStickySuccessCta({ onStartCreating }: { onStartCreating?: () => void }) {
  return (
    <PayEmptyMonthlyStickyFooter slot="pay-empty-monthly-sticky-success">
      <PayEmptyMonthlyStartCreatingButton onStartCreating={onStartCreating} />
    </PayEmptyMonthlyStickyFooter>
  );
}

export function PayEmptyMonthly({
  open = true,
  onBack,
  onPay,
  onStartCreating,
  payLabel,
  className,
  portal,
  cartState = "subscription",
  inputState = "default",
  product,
  failureMessage,
  notice,
  paymentDisabled = false,
}: PayEmptyMonthlyProps) {
  const shouldPortal = portal ?? true;
  const mounted = useIsHydrated();
  const { payLabel: resolvedPayLabel } = resolvePayCopy(cartState, product, payLabel);
  const isDesktop = useIsDesktop(DESKTOP_BREAKPOINT_PX);
  const [cardNumber, setCardNumber] = React.useState("");
  const hasStartedCreatingRef = React.useRef(false);

  const handleStartCreating = React.useCallback(() => {
    if (!onStartCreating || hasStartedCreatingRef.current) return;
    hasStartedCreatingRef.current = true;
    onStartCreating();
  }, [onStartCreating]);

  const startCreating = onStartCreating ? handleStartCreating : undefined;

  const handlePay = React.useCallback(() => {
    // The card number is mapped in browser memory and discarded here. Only the
    // dummy provider token crosses this component boundary; card digits, CVC,
    // expiry, and cardholder name are never sent, logged, or persisted.
    onPay?.(dummyTokenForCardNumber(cardNumber));
  }, [cardNumber, onPay]);
  const handleRequiresAction = React.useCallback(() => onPay?.("dummy_requires_action"), [onPay]);

  React.useEffect(() => {
    hasStartedCreatingRef.current = false;
  }, [inputState, open]);

  React.useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  if (!open) return null;

  const content = (
    <div
      className={cn(
        "relative",
        shouldPortal ? "fixed inset-0 z-[100] h-dvh" : "min-h-dvh",
        className,
      )}
    >
      <div className={cn(shouldPortal ? "h-full overflow-y-auto" : "min-h-dvh")}>
        <PayEmptyMonthlyLayout
          onBack={onBack}
          onPay={handlePay}
          onRequiresAction={handleRequiresAction}
          onStartCreating={startCreating}
          payLabel={payLabel}
          cartState={cartState}
          inputState={inputState}
          product={product}
          failureMessage={failureMessage}
          notice={notice}
          paymentDisabled={paymentDisabled}
          cardNumber={cardNumber}
          onCardNumberChange={setCardNumber}
          isDesktop={isDesktop}
        />
      </div>
      {isDesktop || inputState === "timeout" || paymentDisabled ? null : inputState ===
        "success" ? (
        <PayEmptyMonthlyStickySuccessCta onStartCreating={startCreating} />
      ) : (
        <PayEmptyMonthlyStickyPay
          payLabel={resolvedPayLabel}
          onPay={handlePay}
          isProcessing={inputState === "processing"}
        />
      )}
    </div>
  );

  if (shouldPortal && mounted) {
    return createPortal(content, document.body);
  }

  return content;
}
