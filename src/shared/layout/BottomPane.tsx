import { useEffect, useState, RefObject, PropsWithChildren } from "react";

type BottomPaneProps = PropsWithChildren<{
  parentRef: RefObject<HTMLElement>;
  className?: string;
}>;

export const BottomPane = ({
  children,
  parentRef,
  className = "",
}: BottomPaneProps) => {
  const [isResizing, setIsResizing] = useState(false);
  const [height, setHeight] = useState(50);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!isResizing || !parentRef.current) return;

      const { top, height } = parentRef.current.getBoundingClientRect();
      const offsetParent = e.clientY - top;

      setHeight(100 - Math.min(Math.max(offsetParent / height, 0), 1) * 100);
    };

    document.addEventListener("mousemove", handler);

    return () => document.removeEventListener("mousemove", handler);
  }, [isResizing, parentRef]);

  useEffect(() => {
    const stopResizing = () => setIsResizing(false);
    document.addEventListener("mouseup", stopResizing);
    return () => document.removeEventListener("mouseup", stopResizing);
  }, []);

  return (
    <div
      className={`absolute bottom-0 w-full bg-slate-50`}
      style={{
        height: `${height}%`,
      }}
    >
      <div
        onDoubleClick={() => setHeight(50)}
        onMouseDown={() => setIsResizing(true)}
        className={`relative z-[999] w-full border-b border-slate-300 transition-all before:absolute before:-top-2 before:h-4 before:w-full  before:bg-slate-200 before:opacity-0 before:transition-opacity hover:cursor-row-resize hover:border-slate-500 hover:before:opacity-30 ${
          isResizing && "before:opacity-30"
        }`}
      />
      {children}
    </div>
  );
};
