import { RefObject, useEffect, useState } from "react";

export const useResizeObserver = (ref: RefObject<HTMLElement>) => {
  const [rect, setRect] = useState<DOMRect>();

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const resizeObserver = new ResizeObserver((bounds) => {
      const boundingRect = element.getBoundingClientRect();
      setRect(boundingRect);
    });
    resizeObserver.observe(element);
    return () => resizeObserver.disconnect();
  }, []);

  return rect;
};
