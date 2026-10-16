import { cva } from "class-variance-authority";
import { Menu } from "lucide-react";
import Image from "next/image";
import * as React from "react";

import { cn } from "@/lib/utils";
import {
  CrownFilledIcon,
  LoginIcon,
  LogoutIcon,
  NetworkFilledIcon,
  Setting2Icon,
  TicketIcon,
} from "@/public/assets/icons";
import { ProfileIcon1 } from "@/public/assets/profile-icon-1";

import { Badge } from "../general/badge/badge";
import { NavigationLink, type NavigationLinkProps } from "./navigation-link";

const modalNavVariants = cva(
  "inline-flex w-full max-w-[273px] flex-col gap-3 rounded-[16px] border border-surface-strong bg-tooltip-default-bg p-1 shadow-[0_0_5px_rgba(0,0,0,0.25)]",
);

type ModalNavItem = {
  id: string;
  label: string;
  labelClassName?: string;
  type?: NavigationLinkProps["type"];
  status?: NavigationLinkProps["status"];
  badgeText?: string;
  tooltipText?: string;
  showTooltipOnCollapsed?: boolean;
  showLeftIcon?: boolean;
  showRightIcon?: boolean;
  leftIconSrc?: string;
  rightIconSrc?: string;
  leftIconAlt?: string;
  rightIconAlt?: string;

  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;

  borderRadiusClassName?: string;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  disabled?: boolean;
};

export type ModalNavProps = Omit<React.ComponentProps<"nav">, "children"> & {
  label?: string;
  title?: string;
  closeButtonLabel?: string;
  showCloseButton?: boolean;
  onClose?: React.MouseEventHandler<HTMLButtonElement>;
  items?: ModalNavItem[];
  navLinkBorderRadiusClassName?: string;
};

const loginIcon = <LoginIcon size={24} className="flex-shrink-0" />;
const signupIcon = <ProfileIcon1 size={24} className="flex-shrink-0" />;
const LogoutIcons = <LogoutIcon size={24} className="flex-shrink-0" />;
const networkIcon = <NetworkFilledIcon className="size-6 flex-shrink-0" />;
const settingsIcon = <Setting2Icon className="size-6 flex-shrink-0" />;
const ticketIcon = <TicketIcon className="size-6 flex-shrink-0" />;
const menuIcon = <Menu size={24} className="flex-shrink-0" aria-hidden="true" />;
const corwnIcon = (
  <CrownFilledIcon size={24} tone="solid" className="flex-shrink-0 text-[#FFD900]" />
);
// Rendered unoptimized so the request URL matches the `preload()` call in
// modal-nav-variation.tsx; otherwise next/image requests a separate
// `/_next/image?...` URL and the preload doesn't prevent the pop-in.
const badgeIcon = (
  <Image src={"/assets/spice-coin.png"} alt="" height={24} width={24} unoptimized />
);
const language = (
  <Image src={"/assets/flags/United-States.svg"} alt="" height={24} width={24} unoptimized />
);
const badge = <Badge type={"grey"} size={"medium"} text="+30" />;

export const defaultItems: ModalNavItem[] = [
  {
    id: "signup",
    label: "Sign up",
    type: "default-active",
    status: "expanded",
    leftIcon: signupIcon,
    rightIcon: badge,
  },
  {
    id: "login",
    label: "Login",
    type: "default-active",
    status: "expanded",
    leftIcon: loginIcon,
    showRightIcon: false,
  },
  {
    id: "premium",
    label: "Premium",
    type: "default-active",
    labelClassName: "text-premium-gold",
    status: "badge",
    badgeText: "-75%",
    leftIcon: corwnIcon,
    showRightIcon: false,
  },
  {
    id: "tokens",
    label: "Get Tokens",
    type: "tokens",
    status: "expanded",
    leftIcon: badgeIcon,
    showRightIcon: false,
  },
  {
    id: "language",
    label: "Language",
    type: "default-active",
    status: "expanded",
    leftIcon: language,
    showRightIcon: false,
  },
  {
    id: "affiliates",
    label: "Affiliates",
    type: "default-active",
    status: "expanded",
    leftIcon: networkIcon,
    showRightIcon: false,
  },
  {
    id: "menu",
    label: "Menu",
    type: "default-active",
    status: "expanded",
    leftIcon: menuIcon,
    showRightIcon: false,
  },
  {
    id: "redeem",
    label: "Redeem Coupon",
    type: "default-active",
    status: "expanded",
    leftIcon: ticketIcon,
    showRightIcon: false,
  },
  {
    id: "settings",
    label: "Settings",
    type: "default-active",
    status: "expanded",
    leftIcon: settingsIcon,
    showRightIcon: false,
  },
  {
    id: "logout",
    label: "Logout",
    type: "default-active",
    status: "expanded",
    leftIcon: LogoutIcons,
    showRightIcon: false,
  },
];

export function ModalNav({
  className,
  label = "Modal navigation",
  title = "Menu",
  closeButtonLabel = "Close modal navigation",
  showCloseButton = true,
  onClose,
  items = defaultItems,
  navLinkBorderRadiusClassName = "rounded-[12px]",
  ...props
}: ModalNavProps) {
  return (
    <nav aria-label={label} className={cn(modalNavVariants(), className)} {...props}>
      <div className="flex flex-col gap-0">
        {items.map((item) => (
          <NavigationLink
            className="w-full"
            key={item.id}
            type={item.type ?? "default"}
            status={item.status ?? "expanded"}
            label={item.label}
            labelClassName={item.labelClassName}
            badgeText={item.badgeText}
            tooltipText={item.tooltipText ?? item.label}
            showTooltipOnCollapsed={item.showTooltipOnCollapsed ?? true}
            showLeftIcon={item.showLeftIcon}
            showRightIcon={item.showRightIcon}
            leftIcon={item.leftIcon}
            rightIcon={item.rightIcon}
            leftIconSrc={item.leftIconSrc}
            rightIconSrc={item.rightIconSrc}
            leftIconAlt={item.leftIconAlt}
            rightIconAlt={item.rightIconAlt}
            borderRadiusClassName={item.borderRadiusClassName ?? navLinkBorderRadiusClassName}
            onClick={item.onClick}
            disabled={item.disabled}
          />
        ))}
      </div>
    </nav>
  );
}
