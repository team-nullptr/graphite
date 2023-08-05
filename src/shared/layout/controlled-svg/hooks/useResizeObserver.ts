import { RefObject, useEffect, useState } from "react";

export const useResizeObserver = (ref: RefObject<HTMLElement>): DOMRect => {
  const [rect, setRect] = useState<DOMRect>(new DOMRect());

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const resizeObserver = new ResizeObserver(() => {
      const newBoundingRect = element.getBoundingClientRect();
      setRect(newBoundingRect);
    });

    resizeObserver.observe(element);

    return () => resizeObserver.disconnect();
  }, []);

  return rect;
};
