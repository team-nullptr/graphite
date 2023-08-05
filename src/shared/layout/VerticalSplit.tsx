import { ReactNode, useEffect, useRef, useState } from "react";
import { cn } from "~/lib/utils";

const useVerticalSplit = <E extends HTMLElement>() => {
  const ref = useRef<E>(null);
  const [leftShare, setLeftShare] = useState(50);
  const [isResizing, setIsResizing] = useState(false);

  const resetLeftShare = () => setLeftShare(50);

  useEffect(() => {
    const stopResizing = () => setIsResizing(false);
    document.addEventListener("mouseup", stopResizing);

    return () => document.removeEventListener("mouseup", stopResizing);
  }, []);

  useEffect(() => {
    const handleResize = (e: MouseEvent) => {
      if (!isResizing || !ref.current) {
        return;
      }

      const { width, left } = ref.current.getBoundingClientRect();
      const offsetRef = e.clientX - left;

      setLeftShare(Math.min(Math.max(offsetRef / width, 0), 1) * 100);
    };

    document.addEventListener("mousemove", handleResize);

    return () => document.removeEventListener("mousemove", handleResize);
  }, [isResizing]);

  return {
    leftShare,
    isResizing,
    setIsResizing,
    resetLeftShare,
    ref,
  };
};

export type SplitLayoutProps = {
  left: ReactNode;
  right: ReactNode;
};

export const VerticalSplit = ({ left, right }: SplitLayoutProps) => {
  const { leftShare, isResizing, setIsResizing, resetLeftShare, ref } =
    useVerticalSplit<HTMLDivElement>();

  return (
    <div className="flex h-full min-h-0 w-full overflow-hidden" ref={ref}>
      <div
        className="h-full min-h-0 overflow-hidden"
        style={{ width: `${leftShare}%` }}
      >
        {left}
      </div>
      <div
        onDoubleClick={resetLeftShare}
        onMouseDown={() => setIsResizing(true)}
        className={cn(
          "relative z-10 h-full border-r border-slate-300 transition-all before:absolute before:-left-2 before:h-full before:w-4 before:bg-slate-200 before:opacity-0  before:transition-opacity hover:cursor-col-resize hover:border-slate-400 hover:before:opacity-30",
          isResizing && "cursor-col-resize before:opacity-30"
        )}
      />
      <div className="min-h-0 flex-1 overflow-hidden">{right}</div>
    </div>
  );
};
