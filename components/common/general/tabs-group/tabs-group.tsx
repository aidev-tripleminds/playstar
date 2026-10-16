"use client";

import Image from "next/image";
import { useLayoutEffect, useRef, useState } from "react";

import { HelpIcon } from "@/public/assets/icons/circle-help";

import { Badge } from "../badge/badge";

// ─── Types ────────────────────────────────────────────────────────────────────
type Variant = "compact" | "lines";

type Tab = {
  label: string;
  subLabel?: string;
  showIcon?: boolean;
  leftIcon?: React.ReactNode;
  leftIconSrc?: string;

  // ✅ Discount variation
  discountedPrice?: string;
  originalPrice?: string;

  // ✅ Optional badge
  showBadge?: boolean;
  badgeText?: string;

  // ✅ Badge type
  badgeType?: "rose" | "neutral" | "grey" | "empty";

  /** Applied to the label in every state (e.g. gold Infinite text). */
  labelClassName?: string;
  /** Applied when the tab is not selected. */
  inactiveClassName?: string;
};

type TabGroupProps = {
  variant?: Variant;
  tabs?: Tab[];
  defaultSelected?: number;
  selected?: number;
  onChange?: (index: number) => void;
  /** `fill` stretches tabs; `hug` sizes to content (Figma CompactTabs). */
  fit?: "fill" | "hug";
  className?: string;
};

// ─── Shared Badge ─────────────────────────────────────────────────────────────
const Badges = ({
  offsetY = "-top-3",
  badgeText,
  type = "rose",
}: {
  offsetY?: string;
  badgeText?: string;
  type?: "rose" | "neutral" | "grey" | "empty";
}) => (
  <span
    className={`absolute ${offsetY} left-1/2 z-[2] flex flex-shrink-0 -translate-x-1/2 items-center justify-center`}
  >
    <Badge
      type={type}
      showIcon={false}
      size="small"
      text={badgeText}
      className={type === "neutral" ? "py-[3px]" : "py-1"}
    />
  </span>
);

function TabIcon({ tab }: { tab: Tab }) {
  if (!(tab.showIcon ?? true)) {
    return null;
  }

  if (tab.leftIcon) {
    return <>{tab.leftIcon}</>;
  }

  if (tab.leftIconSrc) {
    return (
      <Image
        src={tab?.leftIconSrc}
        alt=""
        width={20}
        height={20}
        className="size-5 shrink-0 object-contain"
      />
    );
  }

  return <HelpIcon className="size-5 shrink-0 text-current" />;
}

// ─── Glider style helper ──────────────────────────────────────────────────────
function useGlider(selected: number) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [gliderStyle, setGliderStyle] = useState<React.CSSProperties>({});

  useLayoutEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const activeTab = container.children[selected + 1] as HTMLElement;
    if (!activeTab) return;

    const containerRect = container.getBoundingClientRect();
    const tabRect = activeTab.getBoundingClientRect();

    setGliderStyle({
      left: tabRect.left - containerRect.left,
      width: tabRect.width,
    });
  }, [selected]);

  return { containerRef, gliderStyle };
}

// ─── Variant: Compact ─────────────────────────────────────────────────────────
function CompactTabsGroup({
  tabs,
  defaultSelected = 0,
  selected: controlledSelected,
  onChange,
  fit = "fill",
  className,
}: {
  tabs: Tab[];
  defaultSelected?: number;
  selected?: number;
  onChange?: (index: number) => void;
  fit?: "fill" | "hug";
  className?: string;
}) {
  const [internalSelected, setInternalSelected] = useState(defaultSelected);
  const selected = controlledSelected !== undefined ? controlledSelected : internalSelected;
  const { containerRef, gliderStyle } = useGlider(selected);
  const isHug = fit === "hug";

  const selectTab = (index: number) => {
    if (controlledSelected !== undefined) {
      onChange?.(index);
      return;
    }
    setInternalSelected(index);
    onChange?.(index);
  };

  return (
    <div
      ref={containerRef}
      className={`bg-tooltip-default-bg text-divider-label relative flex items-center rounded-full p-1 text-sm shadow-[var(--select-content-shadow)] ${
        isHug ? "w-fit" : "w-full"
      } ${className ?? ""}`}
    >
      {/* Sliding glider */}
      <span
        aria-hidden
        className="bg-surface-strong pointer-events-none absolute top-1 bottom-1 z-[0] rounded-full shadow-[var(--toggle-thumb-shadow)] transition-[left,width] duration-[250ms] ease-[cubic-bezier(.4,0,.2,1)]"
        style={gliderStyle}
      />

      {tabs.map((tab, i) => {
        const isSelected = selected === i;

        return (
          <div
            key={i}
            onClick={() => selectTab(i)}
            className={`relative isolate flex cursor-pointer items-center justify-center gap-2 rounded-full px-3 py-2 transition-colors duration-200 ${
              isHug ? "" : "flex-1"
            } ${isSelected ? "text-tooltip-text bg-surface-strong" : "text-divider-label"}`}
          >
            {/* Badge */}
            {(tab.showBadge ?? true) && (
              <Badges
                offsetY="-top-3"
                badgeText={tab.badgeText}
                type={isSelected ? "rose" : (tab.badgeType ?? "neutral")}
              />
            )}

            <TabIcon tab={tab} />

            <span
              className={`relative z-[1] flex-shrink-0 leading-5 font-medium ${
                tab.labelClassName ??
                (!isSelected && tab.inactiveClassName ? tab.inactiveClassName : "")
              }`}
            >
              {tab.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}

// ─── Variant: Lines ───────────────────────────────────────────────────────────
function LinesTabsGroup({
  tabs,
  defaultSelected = 0,
  selected: controlledSelected,
  onChange,
}: {
  tabs: Tab[];
  defaultSelected?: number;
  selected?: number;
  onChange?: (index: number) => void;
}) {
  const [internalSelected, setInternalSelected] = useState(defaultSelected);

  const selected = controlledSelected !== undefined ? controlledSelected : internalSelected;

  return (
    <div className="bg-tooltip-default-bg relative flex w-fit items-center rounded-2xl">
      {/* Animated Border Indicator */}
      <div
        className="border-tooltip-text bg-surface-strong absolute top-0 bottom-0 left-0 z-[1] rounded-2xl border-[3px] shadow-[var(--toggle-thumb-shadow)] transition-all duration-300 ease-out"
        style={{
          width: `calc(${100 / tabs.length}% - 0px)`,
          transform: `translateX(${selected * 100}%)`,
        }}
      />

      {tabs.map((tab, i) => {
        const isSelected = selected === i;

        const hasDiscount = tab.discountedPrice && tab.originalPrice;

        return (
          <div
            key={i}
            onClick={() => {
              if (controlledSelected !== undefined) {
                onChange?.(i);
              } else {
                setInternalSelected(i);
              }
            }}
            className="relative z-[2] flex w-full cursor-pointer flex-col items-start justify-center gap-0.5 rounded-2xl px-[13px] py-[8px]"
          >
            {/* Badge */}
            {(tab.showBadge ?? true) && (
              <Badges
                offsetY="-top-3"
                badgeText={tab.badgeText}
                type={isSelected ? "rose" : "neutral"}
              />
            )}

            {/* Small label */}
            <span
              className={`text-left text-sm leading-5 font-medium transition-colors duration-200 ${
                isSelected ? "text-tooltip-text" : "text-divider-label"
              }`}
            >
              {tab.label}
            </span>

            {/* Discount variation */}
            {hasDiscount ? (
              <div className="flex items-center gap-1">
                {/* Original Price */}
                <span
                  className={`text-base leading-[24px] font-medium line-through transition-colors duration-200 ${
                    isSelected ? "text-[#FF0080]" : "text-divider-label"
                  }`}
                >
                  {tab.originalPrice}
                </span>

                {/* Discounted Price */}
                <span
                  className={`text-base leading-[24px] font-semibold transition-colors duration-200 ${
                    isSelected ? "text-tooltip-text" : "text-divider-label"
                  }`}
                >
                  {tab.discountedPrice}
                </span>
              </div>
            ) : (
              <span
                className={`text-left text-base leading-6 font-semibold transition-colors duration-200 ${
                  isSelected ? "text-tooltip-text" : "text-divider-label"
                }`}
              >
                {tab.subLabel ?? tab.label}
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── Default tabs ─────────────────────────────────────────────────────────────
const DEFAULT_TABS: Tab[] = [
  {
    label: "My tab",
    subLabel: "My tab",
  },
  {
    label: "My tab",
    discountedPrice: "My tab",
    originalPrice: "My tab",
    badgeText: "-75%",
    showBadge: true,
  },
  {
    label: "My tab",
    subLabel: "My tab",
  },
  {
    label: "My tab",
    discountedPrice: "My tab",
    originalPrice: "My tab",
    badgeText: "-75%",
    showBadge: true,
  },
];

// ─── Root TabGroup Component ──────────────────────────────────────────────────
export default function TabGroup({
  variant = "compact",
  tabs,
  defaultSelected = 0,
  selected,
  onChange,
  fit = "fill",
  className,
}: TabGroupProps) {
  const resolvedTabs = tabs ?? DEFAULT_TABS;

  return (
    <>
      {variant === "compact" && (
        <CompactTabsGroup
          tabs={resolvedTabs}
          defaultSelected={defaultSelected}
          selected={selected}
          onChange={onChange}
          fit={fit}
          className={className}
        />
      )}

      {variant === "lines" && (
        <LinesTabsGroup
          tabs={resolvedTabs}
          defaultSelected={defaultSelected}
          selected={selected}
          onChange={onChange}
        />
      )}
    </>
  );
}
