import { RefObject, useEffect, useState } from "react";
import { scaleCenterToMatchTarget } from "../helpers/scale";
import { getPointInSvgSpace } from "../helpers/svg";

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

    const mouseWheelHandler = (event: WheelEvent) => {
      const scale = getScaleFactor(-event.deltaY);
      setZoom(zoom * scale);

      const mousePosition: Position = [event.clientX, event.clientY];
      // prettier-ignore
      const mousePositionInSVGSpace = getPointInSvgSpace(mousePosition, svgElement);

      // prettier-ignore
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
