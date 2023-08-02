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

    const mouseWheelHandler = (event: WheelEvent) => {
      setZoom((zoom) => {
        return zoom * getScaleFactor(event.deltaY);
      });
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
