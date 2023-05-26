import type { PropsWithChildren } from "react";

export interface ControlsProps {
  className?: string;
}

export const Controls = (props: PropsWithChildren<ControlsProps>) => {
  return (
    <nav className="flex items-center justify-center gap-4 border-b border-base-300 bg-base-200 p-2 dark:border-base-200-dark dark:bg-base-300-dark">
      {props.children}
    </nav>
  );
};

export type ControlsButtonProps = React.DetailedHTMLProps<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
> & {
  icon: JSX.Element;
  alt?: string;
};

export const ControlsButton = ({
  icon,
  alt,
  ...props
}: ControlsButtonProps) => {
  return (
    <button
      aria-label={alt}
      className="group flex h-[30px] w-[30px] cursor-pointer items-center justify-center rounded-md border-none bg-transparent p-0 text-text-base transition-colors hover:bg-base-300 disabled:cursor-auto dark:text-text-base-dark dark:hover:bg-base-200-dark"
      {...props}
    >
      {icon}
    </button>
  );
};
