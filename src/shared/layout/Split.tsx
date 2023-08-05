import { ReactNode, useEffect } from "react";
import { cn } from "~/lib/utils";
import { Orientation, useSplit } from "./useSplit";

const orientationToDimention = {
  vertical: "width",
  horizontal: "height",
} as const;

type InteractiveEdgeProps = {
  active: boolean;
  orientation: Orientation;
  onDoubleClick: () => void;
  onMouseDown: () => void;
};

const InteractiveEdge = ({
  active,
  orientation,
  onDoubleClick,
  onMouseDown,
}: InteractiveEdgeProps) => {
  return (
    <div
      onDoubleClick={onDoubleClick}
      onMouseDown={onMouseDown}
      className={cn(
        "relative z-10 border-slate-300 transition-all before:absolute before:bg-slate-200 before:opacity-0 before:transition-opacity hover:cursor-col-resize hover:border-slate-400 hover:before:opacity-30",
        active && "cursor-col-resize before:opacity-30",
        orientation === "vertical"
          ? "h-full border-r before:-left-2 before:h-full before:w-4"
          : "w-full border-b before:-top-2 before:h-4 before:w-full"
      )}
    />
  );
};

export type SplitProps = {
  orientation: Orientation;
  first: ReactNode;
  second: ReactNode;
};

export const Split = ({ orientation, first, second }: SplitProps) => {
  const { share, isResizing, setIsResizing, resetShare, splitRef } =
    useSplit<HTMLDivElement>({ orientation });

  return (
    <div
      className={cn(
        "flex h-full w-full overflow-hidden",
        orientation === "horizontal" ? "flex-col" : ""
      )}
      ref={splitRef}
    >
      <div
        className="w-full overflow-hidden"
        style={{ [orientationToDimention[orientation]]: `${share}%` }}
      >
        {first}
      </div>
      <InteractiveEdge
        orientation={orientation}
        active={isResizing}
        onDoubleClick={resetShare}
        onMouseDown={() => setIsResizing(true)}
      />
      <div className="w-full flex-1 overflow-auto">{second}</div>
    </div>
  );
};

type DynamicSplitProps = {
  orientation: Orientation;
  active: boolean;
  /** Static pane is the primary view that will be present regardless of split state. */
  staticPane: ReactNode;
  /** Dynami pane will be present if split view is active and won't be present when it is not. */
  dynamicPane: ReactNode;
};

export const DynamicSplit = ({
  orientation,
  active,
  staticPane,
  dynamicPane,
}: DynamicSplitProps) => {
  const { share, setShare, isResizing, setIsResizing, resetShare, splitRef } =
    useSplit<HTMLDivElement>({ orientation: orientation });

  useEffect(() => {
    setShare(active ? 50 : 100);
  }, [active, orientation, setShare]);

  return (
    <div
      className={cn(
        "flex h-full w-full overflow-hidden",
        orientation === "horizontal" ? "flex-col" : "flex-row-reverse"
      )}
      ref={splitRef}
    >
      <div
        className="w-full overflow-hidden bg-slate-50"
        style={{
          [orientationToDimention[orientation]]: `${
            orientation === "horizontal" ? share : 100 - share
          }%`,
        }}
      >
        {staticPane}
      </div>
      {active && (
        <>
          <InteractiveEdge
            active={isResizing}
            orientation={orientation}
            onDoubleClick={resetShare}
            onMouseDown={() => setIsResizing(true)}
          />
          <div className="w-full flex-1 overflow-auto bg-slate-50">
            {dynamicPane}
          </div>
        </>
      )}
    </div>
  );
};
