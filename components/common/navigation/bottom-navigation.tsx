import Image from "next/image";
import * as React from "react";

import { cn } from "@/lib/utils";

import { type MobileLinkItem, MobileLinks } from "./mobile-links";

const bottomNavigationTabs = ["explore", "chat", "create", "generate", "premium"] as const;

export type BottomNavigationTab = (typeof bottomNavigationTabs)[number];

export type BottomNavigationProps = Omit<React.ComponentProps<"nav">, "children"> & {
  label?: string;
  activeTab?: BottomNavigationTab;
  defaultActiveTab?: BottomNavigationTab;
  onTabClick?: (tab: BottomNavigationTab) => void;
  premiumBadgeText?: string;
  showPremiumBadge?: boolean;
  isPremiumUser?: boolean;
};

export function BottomNavigation({
  className,
  label = "Bottom navigation",
  activeTab: controlledActiveTab,
  defaultActiveTab = "explore",
  onTabClick,
  premiumBadgeText = "-75%",
  showPremiumBadge = true,
  isPremiumUser = false,
  ...props
}: BottomNavigationProps) {
  const [internalActiveTab, setInternalActiveTab] =
    React.useState<BottomNavigationTab>(defaultActiveTab);

  const activeTab = controlledActiveTab ?? internalActiveTab;

  const handleTabClick = React.useCallback(
    (tab: BottomNavigationTab) => {
      if (controlledActiveTab === undefined) {
        setInternalActiveTab(tab);
      }
      onTabClick?.(tab);
    },
    [controlledActiveTab, onTabClick],
  );

  const items: MobileLinkItem[] = React.useMemo(() => {
    const tabs: Array<{
      id: BottomNavigationTab;
      label: string;
      icon?: React.ReactNode;
      iconSrc?: string;
      iconAlt?: string;
    }> = [
      {
        id: "explore",
        label: "Explore",
        icon: (
          <Image
            src={
              activeTab === "explore"
                ? "/assets/ai-discover-filled.svg"
                : "/assets/discover-default.svg"
            }
            alt=""
            width={24}
            height={24}
          />
        ),
      },
      {
        id: "chat",
        label: "Chat",
        icon: (
          <Image
            src={activeTab === "chat" ? "/assets/ai-chat-filled.svg" : "/assets/ai-chat.svg"}
            alt=""
            width={24}
            height={24}
          />
        ),
      },
      {
        id: "create",
        label: "Create",
        icon: (
          <Image
            src={activeTab === "create" ? "/assets/ai-add-filled.svg" : "/assets/ai-add.svg"}
            alt=""
            width={24}
            height={24}
          />
        ),
      },
      {
        id: "generate",
        label: "Generate",
        icon: (
          <Image
            src={activeTab === "generate" ? "/assets/ai-play-filled.svg" : "/assets/play-video.svg"}
            alt=""
            width={24}
            height={24}
          />
        ),
      },
      {
        id: "premium",
        label: isPremiumUser ? "Get Tokens" : "Premium",
        icon: isPremiumUser ? (
          <Image src="/assets/spice-coin.png" alt="" width={24} height={24} />
        ) : (
          <Image
            src={
              activeTab === "premium" ? "/assets/crown-filled.svg" : "/assets/crown-outlined.svg"
            }
            alt=""
            width={24}
            height={24}
          />
        ),
      },
    ];

    return tabs.map((tab) => {
      const isActive = tab.id === activeTab;
      const isPremiumTab = tab.id === "premium";

      const variant: MobileLinkItem["variant"] = isActive
        ? isPremiumTab
          ? isPremiumUser
            ? "tokens-selected"
            : "premium-selected"
          : "default-selected"
        : "default";

      return {
        id: tab.id,
        label: tab.label,
        variant,
        icon: tab.icon,
        iconSrc: tab.iconSrc,
        iconAlt: tab.iconAlt,
        showBadge: isPremiumTab ? showPremiumBadge && !isPremiumUser : false,
        badgeText: premiumBadgeText,
        labelClassName: isPremiumTab
          ? isPremiumUser
            ? "text-tokens-gradient"
            : "text-premium-gradient"
          : undefined,
        className: !isActive && !isPremiumTab ? "text-divider-label" : undefined,
      };
    });
  }, [activeTab, isPremiumUser, showPremiumBadge, premiumBadgeText]);

  return (
    <nav aria-label={label} className={cn("w-full", className)} {...props}>
      <div className="w-full rounded-[1000px] bg-[linear-gradient(180deg,rgba(255,255,255,0.00),rgba(255,255,255,0.18))] p-[0.8px]">
        <div className="bg-tooltip-default-bg w-full rounded-[1000px] p-1">
          <MobileLinks
            label={`${label} tabs`}
            className="w-full border-0 px-0 py-0"
            items={items}
            selectable={false}
            onItemClick={(item) => handleTabClick(item.id as BottomNavigationTab)}
          />
        </div>
      </div>
    </nav>
  );
}
