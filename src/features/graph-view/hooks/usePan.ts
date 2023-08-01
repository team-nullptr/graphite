import {
  Dispatch,
  RefObject,
  SetStateAction,
  useCallback,
  useEffect,
  useRef,
} from "react";

type Viewport = [x: number, y: number, w: number, h: number];
type Offset = [x: number, y: number];
type Position = [x: number, y: number];
type Dimensions = [w: number, h: number];

const calculatePositionOffset = (a: Position, b: Position): Offset => {
  const [ax, ay] = a;
  const [bx, by] = b;
  return [bx - ax, by - ay];
};

export const usePan = (
  element: RefObject<SVGSVGElement>,
  elementDimensions: Dimensions,
  setViewport: Dispatch<SetStateAction<Viewport>>,
  enabled: RefObject<boolean>
): void => {
  const isMouseDown = useRef<boolean>(false);
  const previousMousePosition = useRef<Position>([0, 0]);

  const handleMouseDown = useCallback((event: MouseEvent) => {
    if (event.button !== 0 || !enabled.current) {
      return;
    }

    const { clientX, clientY } = event;

    previousMousePosition.current = [clientX, clientY];
    isMouseDown.current = true;
  }, []);

  const handleMouseMove = useCallback(
    (event: MouseEvent) => {
      if (!isMouseDown.current) {
        return;
      }

      const { clientX, clientY } = event;
      const currentMousePosition: Position = [clientX, clientY];

      const delta: Offset = calculatePositionOffset(
        currentMousePosition,
        previousMousePosition.current
      );

      previousMousePosition.current = currentMousePosition;

      setViewport((viewport) => {
        const [x, y, viewportWidth, h] = viewport;
        const [dx, dy] = delta;

        const elementWidth = elementDimensions[0] || 1;
        const scale = viewportWidth / elementWidth;

        return [x + dx * scale, y + dy * scale, viewportWidth, h];
      });
    },
    [elementDimensions]
  );

  const handleMouseUp = useCallback(() => {
    isMouseDown.current = false;
  }, []);

  useEffect(() => {
    const container = element.current;
    if (!container) return;

    container.addEventListener("mousedown", handleMouseDown);
    addEventListener("mousemove", handleMouseMove);
    addEventListener("mouseup", handleMouseUp);

    return () => {
      container.removeEventListener("mousedown", handleMouseDown);
      removeEventListener("mousemove", handleMouseMove);
      removeEventListener("mouseup", handleMouseUp);
    };
  }, [element.current, handleMouseMove]);
};
