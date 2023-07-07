import { useRef, useState, useLayoutEffect, useEffect, ReactNode } from "react";

const useHorizontalSplit = <E extends HTMLElement>() => {
  const ref = useRef<E>(null);
  const [topShare, setTopShare] = useState(0);
  const [isResizing, setIsResizing] = useState(false);

  useLayoutEffect(() => {
    if (!ref.current) {
      console.error("Ref not initialized after initial render.");
      return;
    }

    setTopShare(50);
  }, []);

  useEffect(() => {
    const stopResizing = () => setIsResizing(false);
    document.addEventListener("mouseup", stopResizing);

    return () => document.removeEventListener("mouseup", stopResizing);
  }, []);

  useEffect(() => {
    const handleResize = (e: MouseEvent) => {
      if (!isResizing || !ref.current) return;

      const offsetRef = e.clientY - ref.current.offsetTop;

      setTopShare(
        Math.min(Math.max(offsetRef / ref.current.clientHeight, 0), 1) * 100
      );
    };

    document.addEventListener("mousemove", handleResize);

    return () => document.removeEventListener("mousemove", handleResize);
  }, [isResizing]);

  return {
    topShare,
    isResizing,
    setIsResizing,
    ref,
  };
};

type HorizontalSplitProps = {
  top: ReactNode;
  bottom: ReactNode;
};

export const HorizontalSplit = ({ top, bottom }: HorizontalSplitProps) => {
  const { topShare, isResizing, setIsResizing, ref } =
    useHorizontalSplit<HTMLDivElement>();

  return (
    <div className="flex h-full w-full flex-col" ref={ref}>
      <div className="overflow-auto" style={{ height: `${topShare}%` }}>
        {top}
      </div>

      <div
        onMouseDown={() => setIsResizing(true)}
        className={`relative z-[999] w-full border-b border-slate-300 before:absolute before:-top-2 before:h-4 before:w-full before:bg-slate-200  before:opacity-0 before:transition-opacity hover:cursor-row-resize hover:before:opacity-30 ${
          isResizing && "cursor-col-resize before:opacity-30"
        }`}
      />

      <div className="relative flex-1 overflow-y-auto bg-white">{bottom}</div>
    </div>
  );
};
