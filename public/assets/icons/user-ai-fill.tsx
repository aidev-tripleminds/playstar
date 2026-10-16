import * as React from "react";

export const UserFillIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    width="40"
    height="40"
    viewBox="0 0 40 40"
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
        width="40"
        height="40"
      >
        <path d="M40 0H0V40H40V0Z" fill="white" />
      </mask>

      <g mask="url(#mask0)">
        <path
          d="M32.9167 27.95L31.1167 28.3667C29.8334 28.6667 28.8167 29.6667 28.5167 30.95L28.1001 32.75C28.0667 32.9333 27.7834 32.9333 27.7334 32.75L27.3167 30.95C27.0167 29.6667 26.0167 28.65 24.7334 28.35L22.9334 27.9333C22.7501 27.9 22.7501 27.6167 22.9334 27.5667L24.7334 27.15C26.0167 26.85 27.0334 25.85 27.3334 24.5667L27.7501 22.7667C27.7834 22.5833 28.0667 22.5833 28.1167 22.7667L28.5334 24.5667C28.8334 25.85 29.8334 26.8666 31.1167 27.1666L32.9167 27.5833C33.1001 27.6166 33.1001 27.9 32.9167 27.95Z"
          fill="currentColor"
          stroke="currentColor"
          strokeWidth={1.5}
          strokeMiterlimit={10}
        />

        <path
          d="M19.9998 19.9999C24.5998 19.9999 28.3332 16.2666 28.3332 11.6666C28.3332 7.06659 24.5998 3.33325 19.9998 3.33325C15.3998 3.33325 11.6665 7.06659 11.6665 11.6666C11.6665 16.2666 15.3998 19.9999 19.9998 19.9999Z"
          stroke="currentColor"
          strokeWidth={1.5}
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        <path
          d="M19.9998 25C12.0998 25 5.68311 30.2167 5.68311 36.6667"
          stroke="currentColor"
          strokeWidth={1.5}
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        <path
          d="M34.3164 36.6666C34.3164 35.15 33.9664 33.7166 33.3164 32.3833"
          stroke="currentColor"
          strokeWidth={1.5}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
    </g>

    <defs>
      <clipPath id="clip0">
        <rect width="40" height="40" fill="white" />
      </clipPath>
    </defs>
  </svg>
);
