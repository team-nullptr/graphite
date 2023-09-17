import { useRef, useState, useEffect, useCallback } from "react";

export type Orientation = "vertical" | "horizontal";

export type SplitOptions = {
  orientation: Orientation;
  initialShare?: number;
  reverse?: boolean;
};

export function useSplit<E extends HTMLElement>({
  orientation,
  initialShare = 50,
  reverse = false,
}: SplitOptions) {
  const splitRef = useRef<E>(null);
  const [share, setShare] = useState(initialShare);
  const [isResizing, setIsResizing] = useState(false);

  const setProcessedShare = useCallback(
    (share: number) => setShare(reverse ? 100 - share : share),
    [reverse]
  );

  const resetShare = () => {
    setShare(initialShare);
  };

  useEffect(() => {
    const stopResizing = () => setIsResizing(false);
    document.addEventListener("mouseup", stopResizing);
    return () => document.removeEventListener("mouseup", stopResizing);
  }, []);

  useEffect(() => {
    const handleResize = (e: MouseEvent) => {
      e.preventDefault();

      if (!splitRef.current || !isResizing) {
        return;
      }

      const { width, height, left, top } = splitRef.current.getBoundingClientRect();
      const ratio =
        orientation === "horizontal" ? (e.clientY - top) / height : (e.clientX - left) / width;
      const share = Math.min(Math.max(ratio, 0), 1) * 100;

      setProcessedShare(share);
    };

    document.addEventListener("mousemove", handleResize);
    return () => document.removeEventListener("mousemove", handleResize);
  }, [setProcessedShare, isResizing, orientation]);

  return {
    share,
    setShare,
    isResizing,
    setIsResizing,
    resetShare,
    splitRef,
  };
}
