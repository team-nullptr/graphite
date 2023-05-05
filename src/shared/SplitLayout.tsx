import { useEffect, useLayoutEffect, useRef, useState } from "react";

const useHorizontalSplit = () => {
  const ref = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);
  const [isResizing, setIsResizing] = useState(false);

  // TODO: I really don't like this ..
  useLayoutEffect(() => {
    if (!ref.current) {
      console.error("Ref not initialized after initial render.");
      return;
    }

    setWidth(ref.current.clientWidth / 2);
  }, []);

  useEffect(() => {
    const stopResizing = () => {
      setIsResizing(false);
    };

    document.addEventListener("mouseup", stopResizing);
    return () => document.removeEventListener("mouseup", stopResizing);
  }, []);

  useEffect(() => {
    const handleResize = (e: MouseEvent) => {
      if (!isResizing) return;
      setWidth(e.clientX);
    };

    document.addEventListener("mousemove", handleResize);
    return () => document.removeEventListener("mousemove", handleResize);
  }, [isResizing]);

  return {
    width,
    isResizing,
    setIsResizing,
    ref,
  };
};

export type SplitLayoutProps = {
  left: JSX.Element;
  right: JSX.Element;
};

export const HorizontalSplit = ({ left, right }: SplitLayoutProps) => {
  const { width, isResizing, setIsResizing, ref } = useHorizontalSplit();

  return (
    <div className="flex h-full w-full" ref={ref}>
      <div className="overflow-hidden" style={{ width }}>
        {left}
      </div>
      <div
        onMouseDown={() => setIsResizing(true)}
        className={`relative h-full border-r border-base-300 before:absolute before:-left-2 before:h-full before:w-4 before:bg-base-300  before:opacity-0 before:transition-opacity hover:cursor-col-resize hover:before:opacity-30 ${
          isResizing && "cursor-col-resize before:opacity-30"
        }`}
      />
      <div className="flex-grow">{right}</div>
    </div>
  );
};
