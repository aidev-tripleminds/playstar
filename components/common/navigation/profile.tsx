import { cva, type VariantProps } from "class-variance-authority";
import Image from "next/image";
import * as React from "react";

import { cn } from "@/lib/utils";

const profileVariants = cva(
  "inline-flex items-center justify-center rounded-[12px] p-2 transition-colors duration-150",
  {
    variants: {
      status: {
        default: "bg-tooltip-default-bg  hover:bg-surface-strong ",
      },
    },
    defaultVariants: {
      status: "default",
    },
  },
);

export type ProfileProps = Omit<React.ComponentProps<"button">, "children"> &
  VariantProps<typeof profileVariants> & {
    label?: string;
  };

export function Profile({
  status = "default",
  className,
  label = "Profile",
  ...props
}: ProfileProps) {
  return (
    <button
      type="button"
      aria-label={label}
      className={cn(profileVariants({ status }), className)}
      {...props}
    >
      <Image
        src="/assets/profile-fill.svg"
        alt=""
        width={24}
        height={24}
        className="h-[1.2em] w-[1.2em]"
      />
    </button>
  );
}
