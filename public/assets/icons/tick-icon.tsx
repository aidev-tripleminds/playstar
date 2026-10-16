import * as React from "react";

type TickIconProps = {
  color?: string;
  size?: number;
  className?: string;
  style?: React.CSSProperties;
};

const TickIcon = ({
  color = "var(--gradient-rose)",
  size = 24,
  className,
  style,
}: TickIconProps) => {
  const gradientId = React.useId();

  const isGradient = color.includes("gradient") || color.includes("linear-gradient");

  const tickColor =
    color.toLowerCase() === "#ffffff" || color.toLowerCase() === "white" ? "#000000" : "#ffffff";

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={style}
    >
      {isGradient && (
        <defs>
          <linearGradient
            id={gradientId}
            x1="12"
            y1="2"
            x2="12"
            y2="22"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#F6339A" />
            <stop offset="0.2" stopColor="#E60076" />
            <stop offset="1" stopColor="#C6005C" />
          </linearGradient>
        </defs>
      )}

      {/* Circle */}
      <circle cx="12" cy="12" r="10" fill={isGradient ? `url(#${gradientId})` : color} />

      {/* Tick */}
      <path
        d="M16.78 9.7L11.11 15.37C10.97 15.51 10.78 15.59 10.58 15.59C10.38 15.59 10.19 15.51 10.05 15.37L7.22 12.54C6.93 12.25 6.93 11.77 7.22 11.48C7.51 11.19 7.99 11.19 8.28 11.48L10.58 13.78L15.72 8.64C16.01 8.35 16.49 8.35 16.78 8.64C17.07 8.93 17.07 9.4 16.78 9.7Z"
        fill={tickColor}
      />
    </svg>
  );
};

export default TickIcon;
