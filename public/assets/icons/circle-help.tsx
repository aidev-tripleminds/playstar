import * as React from "react";

import { cn } from "@/lib/utils";

export type HelpIconProps = React.SVGProps<SVGSVGElement>;

export function HelpIcon({ className, ...props }: HelpIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("h-6 w-6 text-current", className)}
      {...props}
    >
      <g clipPath="url(#clip0)">
        <mask
          id="mask0"
          style={{ maskType: "luminance" }}
          maskUnits="userSpaceOnUse"
          x="0"
          y="0"
          width="24"
          height="24"
        >
          <path d="M24 0H0V24H24V0Z" fill="white" />
        </mask>

        <g mask="url(#mask0)">
          <path
            d="M12.0003 12.7901L13.4703 11.9701C14.2103 11.5601 14.6603 10.7901 14.6603 9.9401C14.5703 8.5401 13.3703 7.47011 11.9703 7.55011C10.7203 7.50011 9.61031 8.34011 9.32031 9.56011"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          <path
            d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          <path
            d="M12.1106 16.3376C12.1106 16.3966 12.0599 16.4472 12.0006 16.4387C11.9414 16.4387 11.8906 16.3882 11.8906 16.3292C11.8906 16.2702 11.9414 16.2197 12.0006 16.2197C12.026 16.2197 12.0599 16.2281 12.0768 16.2534C12.0937 16.2702 12.1106 16.3039 12.1106 16.3292"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </g>
      </g>

      <defs>
        <clipPath id="clip0">
          <rect width="24" height="24" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
}
