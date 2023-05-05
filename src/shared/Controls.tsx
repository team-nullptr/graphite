import type { PropsWithChildren } from "react";

export interface ControlsProps {
  className?: string;
}

export const Controls = (props: PropsWithChildren<ControlsProps>) => {
  return (
    <nav className="flex items-center justify-center gap-4 border-b border-base-300 p-2">
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
  className,
  ...props
}: ControlsButtonProps) => {
  return (
    <button
      aria-label={alt}
      className={`${className} group flex h-[30px] w-[30px] cursor-pointer items-center justify-center rounded-md border-none bg-transparent p-0 hover:bg-base-200 disabled:cursor-auto`}
      {...props}
    >
      {icon}
    </button>
  );
};
