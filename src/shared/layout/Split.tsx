import { ReactNode } from "react";
import { cn } from "~/lib/utils";
import { useSplit } from "./useSplit";

export type SplitLayoutProps = {
  left: ReactNode;
  right: ReactNode;
};

export const VerticalSplit = ({ left, right }: SplitLayoutProps) => {
  const { share, isResizing, setIsResizing, resetShare, splitRef } =
    useSplit<HTMLDivElement>("vertical");

  return (
    <div className="flex h-full w-full overflow-hidden" ref={splitRef}>
      <div className="overflow-hidden" style={{ width: `${share}%` }}>
        {left}
      </div>
      <div
        onDoubleClick={resetShare}
        onMouseDown={() => setIsResizing(true)}
        className={cn(
          "relative z-10 h-full border-r border-slate-300 transition-all before:absolute before:-left-2 before:h-full before:w-4 before:bg-slate-200 before:opacity-0  before:transition-opacity hover:cursor-col-resize hover:border-slate-400 hover:before:opacity-30",
          isResizing && "cursor-col-resize before:opacity-30"
        )}
      />
      <div className="flex-1 overflow-hidden">{right}</div>
    </div>
  );
};

export type HorizontalSplitProps = {
  top: ReactNode;
  bottom: ReactNode;
};

export const HorizontalSplit = ({ top, bottom }: HorizontalSplitProps) => {
  const { share, isResizing, setIsResizing, resetShare, splitRef } =
    useSplit<HTMLDivElement>("horizontal");

  return (
    <div className="flex h-full w-full flex-col overflow-hidden" ref={splitRef}>
      <div className="w-full overflow-hidden" style={{ height: `${share}%` }}>
        {top}
      </div>
      <div
        onDoubleClick={resetShare}
        onMouseDown={() => setIsResizing(true)}
        className={cn(
          "relative z-10 w-full border-b border-slate-300 before:absolute before:-top-2 before:h-4 before:w-full before:bg-slate-200  before:opacity-0 before:transition-opacity hover:cursor-row-resize hover:before:opacity-30",
          isResizing && "cursor-col-resize before:opacity-30"
        )}
      />
      <div className="w-full flex-1 overflow-auto">{bottom}</div>
    </div>
  );
};
