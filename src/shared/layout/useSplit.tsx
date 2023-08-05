import { useRef, useState, useEffect } from "react";

export type SplitVariant = "vertical" | "horizontal";

export const useSplit = <E extends HTMLElement>(variant: SplitVariant) => {
  const splitRef = useRef<E>(null);
  const [share, setShare] = useState(50);
  const [isResizing, setIsResizing] = useState(false);

  const resetShare = () => setShare(50);

  useEffect(() => {
    const stopResizing = () => setIsResizing(false);
    document.addEventListener("mouseup", stopResizing);
    return () => document.removeEventListener("mouseup", stopResizing);
  }, []);

  useEffect(() => {
    const handleResize = (e: MouseEvent) => {
      if (!splitRef.current || !isResizing) {
        return;
      }

      const { width, height, left, top } =
        splitRef.current.getBoundingClientRect();

      const ratio =
        variant === "horizontal"
          ? (e.clientY - top) / height
          : (e.clientX - left) / width;

      setShare(Math.min(Math.max(ratio, 0), 1) * 100);
    };

    document.addEventListener("mousemove", handleResize);
    return () => document.removeEventListener("mousemove", handleResize);
  });

  return {
    share,
    isResizing,
    setIsResizing,
    resetShare,
    splitRef,
  };
};
