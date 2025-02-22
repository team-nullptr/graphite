import {
  ArrowsPointingInIcon,
  PlusIcon,
  MinusIcon,
  BoltIcon,
  BoltSlashIcon,
} from "@heroicons/react/24/outline";
import * as ToolbarPrimitive from "@radix-ui/react-toolbar";
import { cn } from "~/lib/utils";
import { ComponentProps, ElementRef, forwardRef } from "react";
import { Tooltip } from "~/shared/ui/Tooltip";

export const ToolbarButton = forwardRef<
  ElementRef<typeof ToolbarPrimitive.Button>,
  ComponentProps<typeof ToolbarPrimitive.Button>
>(({ className, ...props }, ref) => {
  return (
    <ToolbarPrimitive.Button
      ref={ref}
      className={cn(
        "flex h-10 w-10 items-center justify-center rounded-sm bg-slate-50 transition-colors",
        className
      )}
      {...props}
    />
  );
});

export type ToolbarProps = {
  zoom: number;
  onCenter: () => void;
  onZoomReset: () => void;
  onZoomDecrease: () => void;
  onZoomIncrease: () => void;
  isForceLayoutEnabled: boolean;
  onForceLayoutToggle: () => void;
  className?: string;
};

export function Toolbar({
  zoom,
  onCenter,
  onZoomReset,
  onZoomDecrease,
  onZoomIncrease,
  isForceLayoutEnabled,
  onForceLayoutToggle,
  className,
}: ToolbarProps) {
  return (
    <div>
      <ToolbarPrimitive.Root
        className={cn("pointer-events-auto flex w-fit gap-4", className)}
        aria-label="Graph view controls"
      >
        <Tooltip
          label={isForceLayoutEnabled ? "Disable Force Layou" : "Enable Force Layout"}
          asChild
        >
          <ToolbarButton onClick={onForceLayoutToggle} className="border border-slate-300">
            {isForceLayoutEnabled ? (
              <BoltIcon className="h-5 w-5 text-slate-800" />
            ) : (
              <BoltSlashIcon className="h-5 w-5 text-slate-800" />
            )}
          </ToolbarButton>
        </Tooltip>
        <ToolbarButton onClick={onCenter} className="border border-slate-300">
          <ArrowsPointingInIcon className="h-5 w-5 text-slate-800" />
        </ToolbarButton>
        <div className="flex rounded-sm border border-slate-300 bg-slate-50">
          <ToolbarButton onClick={onZoomDecrease}>
            <MinusIcon className="h-5 w-5 text-slate-800" />
          </ToolbarButton>
          <ToolbarButton onClick={onZoomReset}>{(zoom * 100).toFixed(0)}%</ToolbarButton>
          <ToolbarButton onClick={onZoomIncrease}>
            <PlusIcon className="h-5 w-5 text-slate-800" />
          </ToolbarButton>
        </div>
      </ToolbarPrimitive.Root>
    </div>
  );
}
