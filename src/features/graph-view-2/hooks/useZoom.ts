import { RefObject, useEffect, useState } from "react";

export type Position = [x: number, y: number];
export type Offset = [x: number, y: number];

export const useZoom = (
  svgRef: RefObject<SVGSVGElement>
): {
  center: Position;
  zoom: number;
} => {
  const [zoom, setZoom] = useState(1);
  const [center, setCenter] = useState<Position>([0, 0]);

  useEffect(() => {
    const svgElement = svgRef.current;
    if (!svgElement) {
      return;
    }

    // prettier-ignore
    const mouseWheelHandler = (event: WheelEvent) => {
      const scale = getScaleFactor(-event.deltaY);
      setZoom(zoom * scale);

      const mousePosition: Position = [event.clientX, event.clientY];
      const mousePositionInSVGSpace = getPointInSvgSpace(mousePosition, svgElement);

      const scaleCenterToMatchTarget = (center: Position, target: Position, scale: number): Position => {
        const newCenterX = scaleAxisCenterToMatchTarget(center[0], target[0], scale);
        const newCenterY = scaleAxisCenterToMatchTarget(center[1], target[1], scale);
        return [newCenterX, newCenterY];
      }

      const scaleAxisCenterToMatchTarget = (center: number, target: number, scale: number): number => {
        const delta = target - center;
        return target - delta / scale;
      }

      const newCenter = scaleCenterToMatchTarget(center, mousePositionInSVGSpace, scale);
      setCenter(newCenter);
    };

    svgElement.addEventListener("wheel", mouseWheelHandler);

    return () => {
      svgElement.removeEventListener("wheel", mouseWheelHandler);
    };
  });

  return { center, zoom };
};

const getScaleFactor = (delta: number): number => {
  const scale = delta / 1000;
  if (Math.abs(scale) >= 0.1) {
    return 1 + scale;
  }
  return 1 + delta / 10 / Math.abs(delta || 1);
};

const getPointInSvgSpace = ([x, y]: Position, svg: SVGSVGElement): Position => {
  const point = new DOMPoint(x, y);
  const svgViewportOffsetMatrix = svg.getScreenCTM()?.inverse();
  const { x: pointInSVGSpaceX, y: pointInSVGSpaceY } = point.matrixTransform(
    svgViewportOffsetMatrix
  );
  return [pointInSVGSpaceX, pointInSVGSpaceY];
};
