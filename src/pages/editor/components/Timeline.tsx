import { MouseEventHandler, useEffect, useRef, useState } from "react";
import { cn } from "~/lib/utils";

type TimelineProps = {
  currentStep: number;
  numberOfSteps: number;
  onStepChange: (step: number) => void;
};

const stepBlockWidth = 64;
const stepBlockGap = 4;

export const Timeline = ({
  currentStep,
  numberOfSteps,
  onStepChange,
}: TimelineProps) => {
  // TODO: Allow to jump to step with timeline.
  const timelineRef = useRef<HTMLDivElement>(null);

  const [dragging, setDragging] = useState(false);
  const [dragState, setDragState] = useState<{ x: number; scroll: number }>({
    x: 0,
    scroll: 0,
  });

  useEffect(() => {
    if (!dragging) return;

    const resetDrag = () => setDragging(false);
    window.addEventListener("mouseup", resetDrag);
    return () => window.removeEventListener("mouseup", resetDrag);
  }, [dragging]);

  useEffect(() => {
    if (!dragging) return;

    const handleMove = (e: MouseEvent) => {
      if (!timelineRef.current) return;

      timelineRef.current.scrollLeft =
        dragState.scroll + dragState.x - e.clientX;

      onStepChange(
        Math.max(
          Math.min(
            timelineRef.current.scrollLeft / (stepBlockWidth + stepBlockGap),
            numberOfSteps - 1
          ),
          0
        )
      );
    };

    window.addEventListener("mousemove", handleMove);

    return () => window.removeEventListener("mousemove", handleMove);
  }, [dragState, dragging]);

  const handleMouseDown: MouseEventHandler<HTMLDivElement> = (e) => {
    if (!timelineRef.current) return;

    setDragging(true);
    setDragState({
      x: e.clientX,
      scroll: timelineRef.current.scrollLeft,
    });
  };

  return (
    <div
      className={cn(
        dragging ? "cursor-grabbing" : "cursor-grab",
        "relative h-10"
      )}
      onMouseDown={handleMouseDown}
    >
      <div
        className="no-scrollbar flex h-full w-full snap-x overflow-x-auto bg-slate-50"
        style={{
          gap: stepBlockGap,
        }}
        ref={timelineRef}
      >
        {Array.from({ length: numberOfSteps }).map((_, i) => (
          <div
            key={i}
            className={cn(
              currentStep === i ? "bg-slate-600" : "bg-slate-200",
              "flex h-full shrink-0 select-none snap-center items-center justify-center  text-slate-400 first:ml-[calc(50%-32px)] last:mr-[calc(50%-32px)]"
            )}
            style={{
              width: stepBlockWidth,
            }}
          >
            {i + 1}
          </div>
        ))}
      </div>
    </div>
  );
};
