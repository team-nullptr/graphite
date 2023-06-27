import { useEffect, useRef, useState } from "react";
import { useResizeObserver } from "./hooks/useResizeObserver";

export interface GraphViewProps {
  className: string;
}

export const GraphView = (props: GraphViewProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const containerRect = useResizeObserver(containerRef);

  const [viewport, setViewport] = useState<Viewport>();

  useEffect(() => {
    const container = containerRef.current;
    if (!container || !containerRect) return;

    const svg = container.getElementsByTagName("svg")[0];
    if (!svg) return;

    let viewport: Viewport = [0, 0, containerRect.width, containerRect.height];

    const wheelHandler = (event: WheelEvent) => {
      event.preventDefault();

      const { deltaY, clientX, clientY } = event;

      const scale = getScaleFactor(deltaY);
      const pointInSvgSpace = getPointInSvgSpace(clientX, clientY, svg);

      let [viewportOffsetX, viewportOffsetY, viewportWidth, viewportHeight] =
        viewport;

      const [newX, newWidth] = scaleAxis(
        viewportOffsetX,
        viewportOffsetX + viewportWidth,
        pointInSvgSpace.x,
        1 + scale
      );
      const [newY, newHeight] = scaleAxis(
        viewportOffsetY,
        viewportOffsetY + viewportHeight,
        pointInSvgSpace.y,
        1 + scale
      );

      viewport = [newX, newY, newWidth, newHeight];
      setViewport(viewport as Viewport);
    };

    container.addEventListener("wheel", wheelHandler);
    return () => container.removeEventListener("wheel", wheelHandler);
  }, [containerRef.current, containerRect]);

  return (
    <>
      <div ref={containerRef} className={props.className + " overflow-hidden"}>
        <svg className="h-full w-full" viewBox={viewport?.join(" ")}>
          <circle cx={50} cy={50} r={25} fill="blue" />
          <rect x={95} y={50} width={40} height={20} fill="red" />
          <circle cx={250} cy={150} r={25} fill="pink" />
          <rect x={305} y={50} width={15} height={45} fill="gold" />
          <rect x={505} y={50} width={40} height={75} fill="lime" />
        </svg>
      </div>
    </>
  );
};

type Viewport = [x: number, y: number, width: number, height: number];

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
    return scale;
  }
  return delta / 10 / Math.abs(delta || 1);
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
