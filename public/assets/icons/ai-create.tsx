import * as React from "react";

type PlayVideoIconProps = {
  className?: string;
  size?: number;
  premium?: boolean;
};

export const AiCreateIcon = ({ className, size = 24, premium = false }: PlayVideoIconProps) => {
  const uid = React.useId().replace(/:/g, "");

  const strokeColor = premium ? `url(#premiumGrad-${uid})` : "currentColor";

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <g clipPath={`url(#clip-${uid})`}>
        <path d="M24 0H0V24H24V0Z" />

        <path
          d="M21.86 13.67C21.95 13.13 22 12.57 22 12C22 6.5 17.5 2 12 2C6.5 2 2 6.5 2 12C2 17.5 6.5 22 12 22C12.79 22 13.56 21.91 14.29 21.73"
          stroke={strokeColor}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M8 12H16"
          stroke={strokeColor}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M12 16V8"
          stroke={strokeColor}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M22.1697 18.5L20.9697 18.78C20.1097 18.98 19.4397 19.64 19.2397 20.5L18.9597 21.7C18.9297 21.82 18.7497 21.82 18.7197 21.7L18.4397 20.5C18.2397 19.64 17.5797 18.97 16.7197 18.77L15.5197 18.49C15.3997 18.46 15.3997 18.28 15.5197 18.25L16.7197 17.97C17.5797 17.77 18.2497 17.11 18.4497 16.25L18.7297 15.05C18.7597 14.93 18.9397 14.93 18.9697 15.05L19.2497 16.25C19.4497 17.11 20.1097 17.78 20.9697 17.98L22.1697 18.26C22.2897 18.29 22.2897 18.47 22.1697 18.5Z"
          stroke={strokeColor}
          strokeWidth="1.5"
          strokeMiterlimit="10"
        />

        <clipPath id="clip0_14325_1125">
          <rect width="24" height="24" fill="white" />
        </clipPath>
      </g>
    </svg>
  );
};
