import { cva, type VariantProps } from "class-variance-authority";
import Image from "next/image";

import { cn } from "@/lib/utils";

import { AI_MODEL_STAT_ICONS, type AiModelSize, type AiModelStat } from "../ai-model.constants";

const aiModelStatsVariants = cva("flex items-center", {
  variants: {
    size: {
      default: "gap-2 md:gap-3",
      tiny: "gap-1.5",
      mobile: "gap-1",
    },
  },
  defaultVariants: {
    size: "default",
  },
});

const aiModelStatIconVariants = cva("shrink-0 object-cover", {
  variants: {
    size: {
      default: "size-3 md:size-4",
      tiny: "size-2.5",
      mobile: "size-2.5",
    },
  },
  defaultVariants: {
    size: "default",
  },
});

const aiModelStatValueVariants = cva("text-tooltip-text font-normal", {
  variants: {
    size: {
      default: "text-[10px] leading-3 md:text-[14px] md:leading-4",
      tiny: "text-[10px] leading-3",
      mobile: "text-[10px] leading-4",
    },
  },
  defaultVariants: {
    size: "default",
  },
});

export type AiModelStatsProps = VariantProps<typeof aiModelStatsVariants> & {
  stats: AiModelStat[];
  size?: AiModelSize;
  className?: string;
};

export function AiModelStats({ stats, size = "default", className }: AiModelStatsProps) {
  return (
    <ul data-slot="ai-model-stats" className={cn(aiModelStatsVariants({ size }), className)}>
      {stats.map((stat) => {
        const iconSrc = stat.iconSrc ?? AI_MODEL_STAT_ICONS[stat.key];

        return (
          <li key={stat.key} className="inline-flex min-w-0 items-center gap-1">
            <Image
              src={iconSrc}
              alt=""
              width={14}
              height={14}
              aria-hidden
              className={cn(aiModelStatIconVariants({ size }))}
            />
            <span
              data-slot="ai-model-stat-value"
              aria-label={stat.ariaLabel}
              className={aiModelStatValueVariants({ size })}
            >
              {stat.value}
            </span>
          </li>
        );
      })}
    </ul>
  );
}
