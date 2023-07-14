import type { PropsWithChildren } from "react";

export type Alignment = "start" | "center" | "end" | "between";

export type ControlsProps = PropsWithChildren<{
  className?: string;
  alignment?: Alignment;
}>;

export const Controls = ({ children, alignment = "center" }: ControlsProps) => {
  const alignmentStyle = `justify-${alignment}`;

  return (
    <nav
      className={`flex items-center ${alignmentStyle} gap-4 border-t border-slate-300 bg-slate-50 p-2`}
    >
      {children}
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
      className="group flex h-[30px] w-[30px] cursor-pointer items-center justify-center rounded-md border-none bg-transparent p-0 text-slate-800 transition-colors hover:bg-slate-100 disabled:cursor-auto"
      {...props}
    >
      {icon}
    </button>
  );
};
