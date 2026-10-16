import { memo, type SVGProps, useId } from "react";

type UnlimitedIconProps = SVGProps<SVGSVGElement> & {
  size?: number;
};

const UnlimitedIcon = ({ size = 20, className, ...props }: UnlimitedIconProps) => {
  const reactId = useId().replaceAll(":", "");
  const clipId = `clip0_unlimited_${reactId}`;
  const maskId = `mask0_unlimited_${reactId}`;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
      {...props}
    >
      <g clipPath={`url(#${clipId})`}>
        <mask
          id={maskId}
          style={{ maskType: "luminance" }}
          maskUnits="userSpaceOnUse"
          x="0"
          y="0"
          width="24"
          height="24"
        >
          <path d="M24 0H0V24H24V0Z" fill="white" />
        </mask>
        <g mask={`url(#${maskId})`}>
          <path
            d="M10.18 9.31921C9.35999 8.18921 8.05001 7.44922 6.54001 7.44922C4.03001 7.44922 1.98999 9.48921 1.98999 11.9992C1.98999 14.5092 4.03001 16.5492 6.54001 16.5492C8.23001 16.5492 9.80001 15.6592 10.67 14.2092L12 11.9992L13.32 9.78918C14.19 8.33918 15.76 7.44922 17.45 7.44922C19.96 7.44922 22 9.48921 22 11.9992C22 14.5092 19.96 16.5492 17.45 16.5492C15.95 16.5492 14.64 15.8092 13.81 14.6792"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </g>
      </g>
      <defs>
        <clipPath id={clipId}>
          <rect width="24" height="24" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
};

export default memo(UnlimitedIcon);
