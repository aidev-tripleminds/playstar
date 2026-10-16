import { memo } from "react";

type InfinityIconProps = {
  color?: string;
};

const InfinityIcon = ({ color }: InfinityIconProps) => {
  const stroke = color ?? "url(#paint0_linear_4864_50019)";

  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g clipPath="url(#clip0_4864_50019)">
        <mask
          id="mask0_4864_50019"
          style={{ maskType: "luminance" }}
          maskUnits="userSpaceOnUse"
          x="0"
          y="0"
          width="20"
          height="20"
        >
          <path d="M20 0H0V20H20V0Z" fill="white" />
        </mask>

        <g mask="url(#mask0_4864_50019)">
          <path
            d="M8.48321 7.76584C7.79987 6.82418 6.70822 6.20752 5.44989 6.20752C3.35822 6.20752 1.6582 7.90751 1.6582 9.99917C1.6582 12.0908 3.35822 13.7908 5.44989 13.7908C6.85822 13.7908 8.16655 13.0492 8.89155 11.8408L9.99988 9.99917L11.0999 8.15749C11.8249 6.94915 13.1332 6.20752 14.5415 6.20752C16.6332 6.20752 18.3332 7.90751 18.3332 9.99917C18.3332 12.0908 16.6332 13.7908 14.5415 13.7908C13.2915 13.7908 12.1999 13.1742 11.5082 12.2325"
            stroke={stroke}
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </g>
      </g>

      <defs>
        {!color ? (
          <linearGradient
            id="paint0_linear_4864_50019"
            x1="9.99571"
            y1="6.20752"
            x2="9.99571"
            y2="13.7908"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#FCC738" />
            <stop offset="0.2" stopColor="#FDAF1C" />
            <stop offset="1" stopColor="#D77B08" />
          </linearGradient>
        ) : null}

        <clipPath id="clip0_4864_50019">
          <rect width="20" height="20" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
};

export default memo(InfinityIcon);
