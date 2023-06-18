import { ReactNode, useEffect, useLayoutEffect, useRef, useState } from "react";

const useVerticalSplit = <E extends HTMLElement>() => {
  const ref = useRef<E>(null);
  const [leftShare, setLeftShare] = useState(0);
  const [isResizing, setIsResizing] = useState(false);

  // TODO: I really don't like this ..
  useLayoutEffect(() => {
    if (!ref.current) {
      console.error("Ref not initialized after initial render.");
      return;
    }

    setLeftShare(50);
  }, []);

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
};

export const VerticalSplit = (props: SplitLayoutProps) => {
  const { leftShare, isResizing, setIsResizing, ref } =
    useVerticalSplit<HTMLDivElement>();

  return (
    <div className="flex h-full w-full" ref={ref}>
      <div className="overflow-hidden" style={{ width: `${leftShare}%` }}>
        {props.left}
      </div>
      <div
        onMouseDown={() => setIsResizing(true)}
        className={`relative z-[999] h-full border-r border-base-300 before:absolute before:-left-2 before:h-full before:w-4 before:bg-base-300 before:opacity-0 before:transition-opacity  hover:cursor-col-resize hover:before:opacity-30 dark:border-base-200-dark dark:before:bg-base-200-dark ${
          isResizing && "cursor-col-resize before:opacity-30"
        }`}
      />
      <div className="flex-1">{props.right}</div>
    </div>
  );
};