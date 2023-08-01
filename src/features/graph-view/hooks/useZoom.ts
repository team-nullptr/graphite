import {
  Dispatch,
  RefObject,
  SetStateAction,
  useCallback,
  useEffect,
} from "react";

type Viewport = [x: number, y: number, w: number, h: number];

export const useZoom = (
  element: RefObject<SVGSVGElement>,
  setViewport: Dispatch<SetStateAction<Viewport>>
): void => {
  // TODO: Add minimum and maximum zoom
  // TODO: Expose zoom percentage 100% -> normal

  const mouseWheelHandler = useCallback(
    (event: WheelEvent, container: SVGSVGElement) => {
      event.preventDefault();
      const { clientX, clientY } = event;

      const scaleFactor = getScaleFactor(event.deltaY);
      console.log(scaleFactor);

      const pointInSvgSpace = getPointInSvgSpace(clientX, clientY, container);

      setViewport((viewport) => {
        const [x, y, w, h] = viewport;

        const [scaledViewportX, scaledViewportWidth] = scaleAxis(
          x,
          x + w,
          pointInSvgSpace.x,
          scaleFactor
        );

        const [scaledViewportY, scaledViewportHeight] = scaleAxis(
          y,
          y + h,
          pointInSvgSpace.y,
          scaleFactor
        );

        return [
          scaledViewportX,
          scaledViewportY,
          scaledViewportWidth,
          scaledViewportHeight,
        ];
      });
    },
    [setViewport]
  );

  useEffect(() => {
    const container = element.current;
    if (!container) return;

    const handler = (event: WheelEvent) => {
      mouseWheelHandler(event, container);
    };

    container.addEventListener("wheel", handler);
    return () => container.removeEventListener("wheel", handler);
  }, [element.current, mouseWheelHandler]);
};

const getPointInSvgSpace = (
  x: number,
  y: number,
  svg: SVGSVGElement
): DOMPoint => {
  const point = new DOMPoint(x, y);
  const svgViewportOffsetMatrix = svg.getScreenCTM()?.inverse();
  return point.matrixTransform(svgViewportOffsetMatrix);
};

const getScaleFactor = (delta: number): number => {
  const scale = delta / 1000;

  if (Math.abs(scale) >= 0.1) {
    return 1 + scale;
  }

  return 1 + delta / 10 / Math.abs(delta || 1);
};

type ViewportAxis = [a: number, length: number];

const scaleAxis = (
  a: number,
  b: number,
  point: number,
  scale: number
): ViewportAxis => {
  const length = b - a;
  const scaledLength = length * scale;

  const proportion = (point - a) / length;
  const scaledPoint = point - proportion * scaledLength;

  return [scaledPoint, scaledLength];
};
