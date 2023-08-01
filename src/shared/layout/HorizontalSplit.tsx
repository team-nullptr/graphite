import { useRef, useState, useEffect, ReactNode } from "react";
import { cn } from "~/lib/utils";

const useHorizontalSplit = <E extends HTMLElement>() => {
  const ref = useRef<E>(null);
  const [topShare, setTopShare] = useState(50);
  const [isResizing, setIsResizing] = useState(false);

  const resetTopShare = () => setTopShare(50);

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

      const { height, top } = ref.current.getBoundingClientRect();
      const offsetRef = e.clientY - top;

      setTopShare(Math.min(Math.max(offsetRef / height, 0), 1) * 100);
    };

    document.addEventListener("mousemove", handleResize);

    return () => document.removeEventListener("mousemove", handleResize);
  }, [isResizing]);

  return {
    topShare,
    isResizing,
    setIsResizing,
    resetTopShare,
    ref,
  };
};

type HorizontalSplitProps = {
  top: ReactNode;
  bottom: ReactNode;
};

export const HorizontalSplit = ({ top, bottom }: HorizontalSplitProps) => {
  const { topShare, isResizing, setIsResizing, resetTopShare, ref } =
    useHorizontalSplit<HTMLDivElement>();

  return (
    <div className="flex h-full min-h-0 w-full flex-col" ref={ref}>
      <div
        className="w-full overflow-auto bg-blue-400"
        style={{ height: `${topShare}%` }}
      >
        {top}
      </div>
      <div
        onDoubleClick={resetTopShare}
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
