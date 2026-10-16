import type { SVGProps } from "react";

/** Figma `iconsax-maximize` at 16px inside the 28px compact expand control. */
export function MaximizeIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M14 6V2H10" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M2 10V14H6" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M14 2L9 7" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M7 9L2 14" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
