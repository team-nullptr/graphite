/* eslint-disable react/no-unknown-property */
import { cn } from "~/lib/utils";

export const LayoutHorizontal = ({ className }: { className?: string }) => {
  return (
    <svg
      className={cn(className)}
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g clip-path="url(#clip0_1_2)">
        <path
          d="M1.5 20.5V3.5C1.5 2.39543 2.39543 1.5 3.5 1.5H20.5C21.6046 1.5 22.5 2.39543 22.5 3.5V20.5C22.5 21.6046 21.6046 22.5 20.5 22.5H3.5C2.39543 22.5 1.5 21.6046 1.5 20.5Z"
          stroke="currentColor"
          stroke-width="1.5"
        />
        <path
          d="M9.5 1.5V12.5M9.5 22.5V12.5M22.5 12.5H9.5"
          stroke="currentColor"
          stroke-width="1.5"
        />
      </g>
      <defs>
        <clipPath id="clip0_1_2">
          <rect width="24" height="24" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
};
