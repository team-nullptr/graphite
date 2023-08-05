import { useRef, useState, useEffect } from "react";

export type Orientation = "vertical" | "horizontal";

type SplitOptions = {
  orientation: Orientation;
  reverse?: boolean;
};

export const useSplit = <E extends HTMLElement>({
  orientation,
  reverse = false,
}: SplitOptions) => {
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
        orientation === "horizontal"
          ? (e.clientY - top) / height
          : (e.clientX - left) / width;

      const share = Math.min(Math.max(ratio, 0), 1) * 100;
      setShare(reverse ? 100 - share : share);
    };

    document.addEventListener("mousemove", handleResize);
    return () => document.removeEventListener("mousemove", handleResize);
  });

  return {
    share,
    setShare,
    isResizing,
    setIsResizing,
    resetShare,
    splitRef,
  };
};
