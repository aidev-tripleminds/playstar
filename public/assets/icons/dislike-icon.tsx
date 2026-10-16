import * as React from "react";

export const DisLikeIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
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
          d="M16.52 5.65039L13.42 3.25039C13.02 2.85039 12.12 2.65039 11.52 2.65039H7.71998C6.51998 2.65039 5.21998 3.55039 4.91998 4.75039L2.51998 12.0504C2.01998 13.4504 2.91998 14.6504 4.41998 14.6504H8.41998C9.01998 14.6504 9.51998 15.1504 9.41998 15.8504L8.91998 19.0504C8.71998 19.9504 9.31998 20.9504 10.22 21.2504C11.02 21.5504 12.02 21.1504 12.42 20.5504L16.52 14.4504"
          stroke="currentColor"
          strokeWidth={1.5}
          strokeMiterlimit={10}
        />
        <path
          d="M21.62 5.65V15.45C21.62 16.85 21.02 17.35 19.62 17.35H18.62C17.22 17.35 16.62 16.85 16.62 15.45V5.65C16.62 4.25 17.22 3.75 18.62 3.75H19.62C21.02 3.75 21.62 4.25 21.62 5.65Z"
          stroke="currentColor"
          strokeWidth={1.5}
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
