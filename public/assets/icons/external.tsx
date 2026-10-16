import type { SVGProps } from "react";

export function ExternalIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M19 13V19C19 19.5304 18.7893 20.0391 18.4142 20.4142C18.0391 20.7893 17.5304 21 17 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V7C3 6.46957 3.21071 5.96086 5 5H11V7H5V19H17V13H19ZM13 3V5H17.586L9.793 12.793L11.207 14.207L19 6.414V11H21V3H13Z"
        fill="#FAFAFA"
      />
    </svg>
  );
}
