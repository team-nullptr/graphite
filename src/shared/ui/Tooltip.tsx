import { ComponentPropsWithoutRef, PropsWithChildren } from "react";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";

export type TooltipProps = PropsWithChildren<{
  label?: string;
}> &
  ComponentPropsWithoutRef<typeof TooltipPrimitive.Trigger>;

export function Tooltip({ label = "", children, ...props }: TooltipProps) {
  return (
    <TooltipPrimitive.Provider>
      <TooltipPrimitive.Root>
        <TooltipPrimitive.Trigger {...props}>{children}</TooltipPrimitive.Trigger>
        <TooltipPrimitive.Content
          sideOffset={5}
          className="z-50 rounded-md bg-slate-800 px-2 py-1 text-sm text-slate-100"
        >
          {label}
          <TooltipPrimitive.Arrow className="fill-slate-800" />
        </TooltipPrimitive.Content>
      </TooltipPrimitive.Root>
    </TooltipPrimitive.Provider>
  );
}
