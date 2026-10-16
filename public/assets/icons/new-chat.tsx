import type { SVGProps } from "react";

export function NewChatIcon(props: SVGProps<SVGSVGElement>) {
  return (
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
          <path d="M0 0H24V24H0V0Z" fill="white" />
        </mask>

        <g mask="url(#mask0)">
          <path
            d="M8 22.75H21C21.96 22.75 22.75 21.96 22.75 21V8C22.75 3.58 20.42 1.25 16 1.25H8C3.58 1.25 1.25 3.58 1.25 8V16C1.25 20.42 3.58 22.75 8 22.75ZM16 2.75C19.58 2.75 21.25 4.42 21.25 8V21C21.25 21.14 21.14 21.25 21 21.25H8C4.42 21.25 2.75 19.58 2.75 16V8C2.75 4.42 4.42 2.75 8 2.75H16Z"
            fill="currentColor"
          />
          <path
            d="M8.5 12.75H15.5C15.91 12.75 16.25 12.41 16.25 12C16.25 11.59 15.91 11.25 15.5 11.25H8.5C8.09 11.25 7.75 11.59 7.75 12C7.75 12.41 8.09 12.75 8.5 12.75Z"
            fill="currentColor"
          />
          <path
            d="M12 16.25C12.41 16.25 12.75 15.91 12.75 15.5V8.5C12.75 8.09 12.41 7.75 12 7.75C11.59 7.75 11.25 8.09 11.25 8.5V15.5C11.25 15.91 11.59 16.25 12 16.25Z"
            fill="currentColor"
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
