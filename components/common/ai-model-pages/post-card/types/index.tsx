import type { VariantProps } from "class-variance-authority";

import type { OptionListItem } from "@/components/common/general/option-list/option-list";

import type { mediaVariants } from "../variants";

export type PostCardMediaRatio = NonNullable<VariantProps<typeof mediaVariants>["ratio"]>;

export type PostCardMediaProps = {
  mediaSrc: string | string[];
  mediaAlt: string;
  ratio: PostCardMediaRatio;
};

export type PostCardFooterProps = {
  chatLabel?: string;
  shareLabel?: string;
  onLike?: () => void;
  onChat?: () => void;
  onShare?: () => void;
  className?: string;
};

export type PostCardProps = React.ComponentProps<"article"> &
  VariantProps<typeof mediaVariants> &
  PostCardFooterProps & {
    avatarSrc?: string;
    displayName?: string;
    handle?: string;
    showVerified?: boolean;
    date?: string;
    body?: string;
    mediaSrc?: string | string[];
    mediaAlt?: string;
    onMenu?: () => void;
    menuItems?: OptionListItem[];
    menuOpen?: boolean;
    defaultMenuOpen?: boolean;
    onMenuOpenChange?: (open: boolean) => void;
    onMenuAction?: (value: string) => void;
  };
