import {
  MutableRefObject,
  RefObject,
  useEffect,
  useRef,
  useState,
} from "react";

export const useResizeObserver = (
  ref: RefObject<HTMLElement>
): [DOMRect | undefined, MutableRefObject<DOMRect | undefined>] => {
  const [rect, setRect] = useState<DOMRect>();
  const previousRect = useRef<DOMRect>();

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const resizeObserver = new ResizeObserver(() => {
      const newBoundingRect = element.getBoundingClientRect();
      setRect((currentRect) => {
        previousRect.current = currentRect;
        return newBoundingRect;
      });
    });
    resizeObserver.observe(element);
    return () => resizeObserver.disconnect();
  }, []);

  return [rect, previousRect];
};
