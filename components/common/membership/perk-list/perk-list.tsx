import type { ComponentType, ReactNode } from "react";

import { cn } from "@/lib/utils";

import { PerkCard } from "../perk-card";

/**
 * ✅ Available variants
 */
type Variant =
  | "yearly"
  | "monthly"
  | "unlimited"
  | "tokens"
  | "signup"
  | "purchased"
  | "joinPremium";

/**
 * ✅ Shared perk item type
 */
export type PerkItem = {
  title: string;
  description?: string;
  iconSrc: string;
  tags?: string[];
  isUnlimited?: boolean;
  showInfinityIcon?: boolean;
  // ✅ ADD THIS
  variant?: "default" | "premium" | "gold" | "unlimited";
};

/**
 * ✅ Generic component block type
 */
type ComponentBlock<T = unknown> = {
  component: ComponentType<T>;
  props?: T;
};

/**
 * ✅ PerkList props
 */
type PerkListProps = {
  variant: Variant;
  children?: ReactNode;
  className?: string;
  secondPerkText?: string;
  thirdPerkText?: string;

  /**
   * ✅ Dynamic line support for all variants
   */
  line?: "one" | "two";

  /**
   * Limit how many perk card blocks are rendered (first N only).
   */
  maxBlocks?: number;

  /**
   * ✅ Custom dynamic items
   */
  items?: PerkItem[];
};

/**
 * ✅ Shared title styles
 */
const titleStyles = {
  one: "text-sm leading-[20px]",
  two: "text-base leading-[24px]",
};

export const PerkList = ({
  variant,
  children,
  className,
  secondPerkText,
  thirdPerkText,

  /**
   * ✅ Default line
   */
  line = "two",

  maxBlocks,

  /**
   * ✅ Custom items
   */
  items,
}: PerkListProps) => {
  /**
   * ✅ Helper for creating perk card blocks
   */
  const createPerkCard = (
    props: React.ComponentProps<typeof PerkCard>,
  ): ComponentBlock<React.ComponentProps<typeof PerkCard>> => ({
    component: PerkCard,
    props,
  });

  /**
   * ✅ Unlimited items
   */
  const unlimitedItems: PerkItem[] = [
    {
      title: "Unlimited Images",
      description: "Generate endlessly from top-tier models",
      iconSrc: "/assets/infinity-icon.svg",
      isUnlimited: true,
      showInfinityIcon: false,
      tags: ["Klams AI", "Klams AI Turbo", "Pony", "SDXL", "Z-Image", "Z-Image Turbo"],
    },
  ];

  /**
   * ✅ Dynamic join premium items
   */
  const joinPremiumItems = items?.length
    ? items
    : [
        {
          title: "200 tokens every month",
          iconSrc: "/assets/spice-coin.png",
        },
        {
          title: "AI Porn Videos + Images",
          iconSrc: "/assets/clapper-board.svg",
        },
        {
          title: "Unlimited Messages",
          iconSrc: "/assets/speech-balloon.svg",
        },
        {
          title: "Audio chat + Voice calls",
          iconSrc: "/assets/mic.svg",
        },
      ];

  /**
   * ✅ Variant blocks
   */
  const blocks: Record<Variant, ComponentBlock<React.ComponentProps<typeof PerkCard>>[]> = {
    yearly: [
      createPerkCard({
        variant: "premium",
        line,
        items: [
          {
            title: "1000 tokens every month",
            description: "All you need in Spicestars AI",
            iconSrc: "/assets/spice-coin.png",
          },
        ],
      }),

      createPerkCard({
        variant: "gold",
        line,
        items: [
          {
            title: "1000 tokens one-time bonus",
            description: "For you, as welcome gift",
            iconSrc: "/assets/gift-icon.svg",
          },
        ],
      }),

      createPerkCard({
        variant: "default",
        line,
        items: [
          {
            title: "AI Porn Videos + Images",
            description: "Fully customize your content",
            iconSrc: "/assets/clapper-board.svg",
          },
        ],
      }),

      createPerkCard({
        variant: "default",
        line,
        items: [
          {
            title: "Unlimited Messages",
            description: "Chat without limits or restrictions",
            iconSrc: "/assets/speech-balloon.svg",
          },
        ],
      }),

      createPerkCard({
        variant: "default",
        line,
        items: [
          {
            title: "Unlimited Audio Messages",
            description: "Lifelike, realistic interactions",
            iconSrc: "/assets/mic.svg",
          },
        ],
      }),

      createPerkCard({
        variant: "default",
        line,
        items: [
          {
            title: "Voice Call Your AI Crush",
            description: "Real-time, natural voice conversations",
            iconSrc: "/assets/phone-green.svg",
          },
        ],
      }),
    ],

    monthly: [
      createPerkCard({
        variant: "premium",
        line,
        items: [
          {
            title: "1000 tokens every month",
            description: "All you need in Spicestars AI",
            iconSrc: "/assets/spice-coin.png",
          },
        ],
      }),

      createPerkCard({
        variant: "default",
        line,
        items: [
          {
            title: "AI Porn Videos + Images",
            description: "Fully customize your content",
            iconSrc: "/assets/clapper-board.svg",
          },
        ],
      }),

      createPerkCard({
        variant: "default",
        line,
        items: [
          {
            title: "Unlimited Messages",
            description: "Chat without limits or restrictions",
            iconSrc: "/assets/speech-balloon.svg",
          },
        ],
      }),

      createPerkCard({
        variant: "default",
        line,
        items: [
          {
            title: "Unlimited Audio Messages",
            description: "Lifelike, realistic interactions",
            iconSrc: "/assets/mic.svg",
          },
        ],
      }),

      createPerkCard({
        variant: "default",
        line,
        items: [
          {
            title: "Voice Call Your AI Crush",
            description: "Real-time, natural voice conversations",
            iconSrc: "/assets/phone-green.svg",
          },
        ],
      }),
    ],

    unlimited: [
      createPerkCard({
        variant: "default",
        line,
        items: [
          {
            title: "1000 tokens one-time bonus",
            description: "For you, as welcome gift",
            iconSrc: "/assets/gift-icon.svg",
          },
        ],
      }),

      createPerkCard({
        variant: "premium",
        line,
        items: [
          {
            title: "1000 tokens every month",
            description: "All you need in Spicestars AI",
            iconSrc: "/assets/spice-coin.png",
          },
        ],
      }),

      createPerkCard({
        variant: "default",
        line,
        items: [
          {
            title: "AI Porn Videos + Images",
            description: "Fully customize your content",
            iconSrc: "/assets/clapper-board.svg",
          },
        ],
      }),

      createPerkCard({
        variant: "default",
        line,
        items: [
          {
            title: "Unlimited Messages",
            description: "Chat without limits or restrictions",
            iconSrc: "/assets/speech-balloon.svg",
          },
        ],
      }),

      createPerkCard({
        variant: "default",
        line,
        items: [
          {
            title: "Unlimited Audio Messages",
            description: "Lifelike, realistic interactions",
            iconSrc: "/assets/mic.svg",
          },
        ],
      }),

      createPerkCard({
        variant: "default",
        line,
        items: [
          {
            title: "Voice Call Your AI Crush",
            description: "Real-time, natural voice conversations",
            iconSrc: "/assets/phone-green.svg",
          },
        ],
      }),
    ],

    tokens: [
      createPerkCard({
        variant: "premium",
        line,
        items: [
          {
            title: "1000 tokens every month",
            description: "All you need in Spicestars AI",
            iconSrc: "/assets/spice-coin.png",
          },
        ],
      }),

      createPerkCard({
        variant: "default",
        line,
        items: [
          {
            title: "No expiration date",
            description: "Your tokens never expire",
            iconSrc: "/assets/expire-date.svg",
          },
        ],
      }),

      createPerkCard({
        variant: "default",
        line,
        items: [
          {
            title: "Access to all premium features",
            description: "Unlock every tool and feature",
            iconSrc: "/assets/crown.svg",
          },
        ],
      }),

      createPerkCard({
        variant: "default",
        line,
        items: [
          {
            title: "Privacy in bank statement",
            description: "Discreet billing, no explicit descriptors",
            iconSrc: "/assets/lock-privacy.svg",
          },
        ],
      }),
    ],

    signup: [
      createPerkCard({
        variant: "gold",
        line,
        items: [
          {
            title: secondPerkText || "Unlimited free chat",
            iconSrc: "/assets/speech-balloon.svg",
          },
        ],
      }),

      createPerkCard({
        variant: "default",
        line,
        items: [
          {
            title: thirdPerkText || "Unlimited free content",
            iconSrc: "/assets/clapper-board.svg",
          },
        ],
      }),
    ],

    joinPremium: joinPremiumItems.map((item, index) =>
      createPerkCard({
        variant: item.variant ?? (index === 0 ? "premium" : index === 1 ? "gold" : "default"),

        line,
        items: [item],
      }),
    ),

    purchased: [
      createPerkCard({
        variant: "default",
        line,
        items: [
          {
            title: "AI Porn Videos + Images",
            iconSrc: "/assets/tick_gray.svg",
          },
        ],
      }),

      createPerkCard({
        variant: "default",
        line,
        items: [
          {
            title: "200 tokens",
            iconSrc: "/assets/tick_gray.svg",
          },
        ],
      }),

      createPerkCard({
        variant: "default",
        line,
        items: [
          {
            title: "Access to all features",
            iconSrc: "/assets/tick_gray.svg",
          },
        ],
      }),

      createPerkCard({
        variant: "default",
        line,
        items: [
          {
            title: "Voice Call Your AI Crush",
            iconSrc: "/assets/tick_gray.svg",
          },
        ],
      }),
    ],
  };

  return (
    <div className={cn("flex flex-col gap-1", className)}>
      {/* ✅ Unlimited top card */}
      {variant === "unlimited" && (
        <PerkCard
          variant="unlimited"
          line={line}
          titleClassName={titleStyles[line]}
          items={unlimitedItems}
        />
      )}

      {/* ✅ Render variant blocks */}
      {blocks[variant].slice(0, maxBlocks).map((block, i) => {
        const Component = block.component;

        return <Component key={i} {...block.props} />;
      })}

      {/* ✅ Optional children */}
      {children}
    </div>
  );
};
