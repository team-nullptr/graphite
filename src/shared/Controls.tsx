import type { PropsWithChildren, ReactNode } from "react";

import { cn } from "~/lib/utils";
import { Tooltip } from "./ui/Tooltip";

// TODO: Remove this and allow to use regular css (tailwind classes)
export type Alignment = "start" | "center" | "end" | "between";

export type ControlsProps = PropsWithChildren<{
  className?: string;
  alignment?: Alignment;
}>;

export function Controls({ children, alignment = "center", className }: ControlsProps) {
  const alignmentStyle = `justify-${alignment}`;

  return (
    <nav className={cn("flex h-10 items-center gap-4 bg-slate-50 px-4", alignmentStyle, className)}>
      {children}
    </nav>
  );
}

export type ControlsButtonProps = React.DetailedHTMLProps<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
> & {
  icon: ReactNode;
  label?: string;
};

export function ControlsButton({ icon, label = "", ...props }: ControlsButtonProps) {
  return (
    <Tooltip label={label} asChild>
      <button
        aria-label={label}
        className="group flex h-[30px] w-[30px] cursor-pointer items-center justify-center rounded-md border-none bg-transparent p-0 text-slate-800 transition-colors hover:bg-slate-100 disabled:cursor-auto disabled:text-slate-400"
        {...props}
      >
        {icon}
      </button>
    </Tooltip>
  );
}
