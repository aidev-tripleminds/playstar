// DiscoverIcon.tsx
import * as React from "react";

type DiscoverIconProps = {
  className?: string;
  premium?: boolean;
};

export function DiscoverIcon({ className, premium = false }: DiscoverIconProps) {
  const uid = React.useId().replace(/:/g, ""); // safe for SVG ids
  const strokeColor = premium ? `url(#premiumGrad-${uid})` : "currentColor";

  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <clipPath id={`clip-${uid}`}>
          <rect width="24" height="24" fill="white" />
        </clipPath>

        {/* Inline gradient per instance — no layout.tsx needed */}
        {premium && (
          <linearGradient id={`premiumGrad-${uid}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.4" />
            <stop offset="21%" stopColor="#ffd900" stopOpacity="0.74" />
            <stop offset="67%" stopColor="#ffd400" stopOpacity="1" />
            <stop offset="100%" stopColor="#ffe320" stopOpacity="0.38" />
          </linearGradient>
        )}
      </defs>

      <g clipPath={`url(#clip-${uid})`}>
        <mask
          id={`mask-${uid}`}
          style={{ maskType: "alpha" }}
          maskUnits="userSpaceOnUse"
          x="0"
          y="0"
          width="24"
          height="24"
        >
          <path d="M24 0H0V24H24V0Z" fill="white" />
        </mask>
        <g mask={`url(#mask-${uid})`}>
          <path
            d="M8.60997 5.85L7.70997 6.06C7.06997 6.21 6.55997 6.71 6.40997 7.36L6.19997 8.26C6.17997 8.36 6.03997 8.36 6.01997 8.26L5.80997 7.36C5.65997 6.72 5.15997 6.21 4.50997 6.06L3.60997 5.85C3.50997 5.83 3.50997 5.69 3.60997 5.67L4.50997 5.46C5.14997 5.31 5.65997 4.81 5.80997 4.16L6.01997 3.26C6.03997 3.16 6.17997 3.16 6.19997 3.26L6.40997 4.16C6.55997 4.8 7.05997 5.31 7.70997 5.46L8.60997 5.67C8.70997 5.69 8.70997 5.83 8.60997 5.85Z"
            stroke={strokeColor}
            strokeWidth="1.5"
            strokeMiterlimit="10"
          />
          <path
            d="M3.67998 12.34L2.34998 17.66C1.61998 20.58 3.40998 22.39 6.34998 21.66L16.03 19.24C17.43 18.89 18.88 17.45 19.23 16.04L21.66 6.34999C22.39 3.42999 20.59 1.61999 17.66 2.34999L12.58 3.61999"
            stroke={strokeColor}
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M12 15.05C13.69 15.05 15.05 13.68 15.05 12C15.05 10.32 13.68 8.94998 12 8.94998C10.32 8.94998 8.95001 10.32 8.95001 12C8.95001 13.68 10.32 15.05 12 15.05Z"
            stroke={strokeColor}
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </g>
      </g>
    </svg>
  );
}
