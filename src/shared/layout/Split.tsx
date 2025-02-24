import { ReactNode, useEffect } from "react";
import { cn } from "~/lib/utils";
import { Orientation, useSplit } from "./useSplit";

const orientationToDimension = {
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
        "relative z-10 border-slate-300 transition-all before:absolute before:bg-slate-200 before:opacity-0 before:transition-opacity  hover:border-slate-400 hover:before:opacity-30",
        active && "cursor-col-resize before:opacity-30",
        orientation === "vertical"
          ? "h-full border-r before:-left-2 before:h-full before:w-4 hover:cursor-col-resize"
          : "w-full border-b before:-top-2 before:h-4 before:w-full hover:cursor-row-resize"
      )}
    />
  );
};

export type SplitProps = {
  orientation: Orientation;
  first: ReactNode;
  second: ReactNode;
  initialShare?: number;
};

export function Split({ orientation, first, second, initialShare }: SplitProps) {
  const { share, isResizing, setIsResizing, resetShare, splitRef } = useSplit<HTMLDivElement>({
    orientation,
    initialShare,
  });

  return (
    <div
      className={cn(
        "flex h-full w-full overflow-hidden",
        orientation === "horizontal" ? "flex-col" : ""
      )}
      ref={splitRef}
    >
      <div
        className="overflow-hidden"
        style={{ [orientationToDimension[orientation]]: `${share}%` }}
      >
        {first}
      </div>
      <InteractiveEdge
        orientation={orientation}
        active={isResizing}
        onDoubleClick={resetShare}
        onMouseDown={() => setIsResizing(true)}
      />
      <div
        className="overflow-auto"
        style={{ [orientationToDimension[orientation]]: `${100 - share}%` }}
      >
        {second}
      </div>
    </div>
  );
}

export type DynamicSplitProps = {
  orientation: Orientation;
  active: boolean;
  initialShare?: number;
  /** Static pane is the primary view that will be present regardless of split state. */
  staticPane: ReactNode;
  /** Dynamic pane will be present if split view is active and won't be present when it is not. */
  dynamicPane: ReactNode;
};

export function DynamicSplit({
  orientation,
  active,
  initialShare = 80,
  staticPane,
  dynamicPane,
}: DynamicSplitProps) {
  const { share, setShare, isResizing, setIsResizing, resetShare, splitRef } =
    useSplit<HTMLDivElement>({
      orientation,
      initialShare,
      reverse: orientation === "vertical",
    });

  useEffect(() => {
    setShare(active ? initialShare : 100);
  }, [active, setShare, initialShare]);

  return (
    <div
      ref={splitRef}
      className={cn(
        "flex h-full w-full overflow-hidden",
        orientation === "horizontal" ? "flex-col" : "flex-row-reverse"
      )}
    >
      <div
        className="overflow-hidden bg-slate-50"
        style={{
          [orientationToDimension[orientation]]: `${share}%`,
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
          <div
            className="overflow-auto bg-slate-50"
            style={{
              [orientationToDimension[orientation]]: `${100 - share}%`,
            }}
          >
            {dynamicPane}
          </div>
        </>
      )}
    </div>
  );
}
