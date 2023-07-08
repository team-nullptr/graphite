import { ReactNode, useEffect, useRef, useState } from "react";

const useVerticalSplit = <E extends HTMLElement>(initialLeftShare: number) => {
  const ref = useRef<E>(null);
  const [leftShare, setLeftShare] = useState(initialLeftShare);
  const [isResizing, setIsResizing] = useState(false);

  useEffect(() => {
    const stopResizing = () => setIsResizing(false);
    document.addEventListener("mouseup", stopResizing);

    return () => document.removeEventListener("mouseup", stopResizing);
  }, []);

  useEffect(() => {
    const handleResize = (e: MouseEvent) => {
      if (!isResizing || !ref.current) return;

      const offsetRef = e.clientX - ref.current.offsetLeft;

      setLeftShare(
        Math.min(Math.max(offsetRef / ref.current.clientWidth, 0), 1) * 100
      );
    };

    document.addEventListener("mousemove", handleResize);

    return () => document.removeEventListener("mousemove", handleResize);
  }, [isResizing]);

  return {
    leftShare,
    isResizing,
    setIsResizing,
    ref,
  };
};

export type SplitLayoutProps = {
  left: ReactNode;
  right: ReactNode;
  initialLeftShare?: number;
};

export const VerticalSplit = ({
  left,
  right,
  initialLeftShare = 50,
}: SplitLayoutProps) => {
  const { leftShare, isResizing, setIsResizing, ref } =
    useVerticalSplit<HTMLDivElement>(initialLeftShare);

  return (
    <div className="flex h-full w-full" ref={ref}>
      <div
        className="h-full w-full overflow-hidden"
        style={{ width: `${leftShare}%` }}
      >
        {left}
      </div>
      <div
        onMouseDown={() => setIsResizing(true)}
        className={`relative z-[999] h-full border-r border-slate-300 before:absolute before:-left-2 before:h-full before:w-4 before:bg-slate-200  before:opacity-0 before:transition-opacity hover:cursor-col-resize hover:before:opacity-30 ${
          isResizing && "cursor-col-resize before:opacity-30"
        }`}
      />
      <div className="w-full flex-1 overflow-hidden">{right}</div>
    </div>
  );
};
