import { RefObject, useEffect, useRef, useState } from "react";
import { scaleCenterToMatchTarget } from "../helpers/scale";
import { getPointInSvgSpace } from "~/shared/helpers/svg";

export type Position = [x: number, y: number];
export type Offset = [x: number, y: number];

const zoomBounds = {
  min: 0.5,
  max: 5,
};

export const useSvgControls = (
  svgRef: RefObject<SVGSVGElement>,
  isZoomEnabled?: RefObject<boolean>,
  isPanEnabled?: RefObject<boolean>
): {
  center: Position;
  setCenter: (center: Position) => void;
  zoom: number;
  setZoom: (zoom: number) => void;
} => {
  const [zoom, setZoom] = useState(1);
  const [center, setCenter] = useState<Position>([0, 0]);

  const normalizeZoom = (zoom: number) =>
    Math.max(Math.min(zoom, zoomBounds.max), zoomBounds.min);

  // Zooming

  useEffect(() => {
    const svgElement = svgRef.current;

    if (!svgElement) {
      return;
    }

    let prevZoom = 0;

    const mouseWheelHandler = (event: WheelEvent) => {
      event.preventDefault();

      if (isZoomEnabled?.current === false) {
        return;
      }

      const scale = getScaleFactor(-event.deltaY);

      setZoom((zoom) => {
        const newZoom = normalizeZoom(zoom * scale);
        prevZoom = newZoom;
        return newZoom;
      });

      if (
        (prevZoom >= zoomBounds.max && scale > 1) ||
        (prevZoom <= zoomBounds.min && scale < 1)
      ) {
        return;
      }

      const mousePosition: Position = [event.clientX, event.clientY];
      const mousePositionInSVGSpace = getPointInSvgSpace(
        mousePosition,
        svgElement
      );

      setCenter((center) => {
        return scaleCenterToMatchTarget(center, mousePositionInSVGSpace, scale);
      });
    };

    svgElement.addEventListener("wheel", mouseWheelHandler);

    return () => {
      svgElement.removeEventListener("wheel", mouseWheelHandler);
    };
  }, [isZoomEnabled, svgRef]);

  // Panning

  const previousMousePositionRef = useRef<Position>([0, 0]);
  const isMouseDownRef = useRef<boolean>(false);

  useEffect(() => {
    const svgElement = svgRef.current;
    if (!svgElement) {
      return;
    }

    const mouseDownHandler = (event: MouseEvent) => {
      previousMousePositionRef.current = [event.clientX, event.clientY];
      isMouseDownRef.current = true;
    };

    const mouseUpHandler = () => {
      isMouseDownRef.current = false;
    };

    svgElement.addEventListener("mousedown", mouseDownHandler);
    addEventListener("mouseup", mouseUpHandler);

    return () => {
      svgElement.removeEventListener("mousedown", mouseDownHandler);
      removeEventListener("mouseup", mouseUpHandler);
    };
  }, [svgRef]);

  useEffect(() => {
    const svgElement = svgRef.current;
    if (!svgElement) {
      return;
    }

    const mouseMoveHandler = (event: MouseEvent) => {
      if (!isMouseDownRef.current) {
        return;
      }
      if (isPanEnabled?.current === false) {
        return;
      }
      event.preventDefault(); // Prevent selecting text
      const previousMousePosition = previousMousePositionRef.current;
      const currentMousePosition: Position = [event.clientX, event.clientY];
      const mousePositionDelta = [
        currentMousePosition[0] - previousMousePosition[0],
        currentMousePosition[1] - previousMousePosition[1],
      ];
      previousMousePositionRef.current = currentMousePosition;
      setCenter((center) => {
        return [
          center[0] - mousePositionDelta[0] / zoom,
          center[1] - mousePositionDelta[1] / zoom,
        ];
      });
    };

    addEventListener("mousemove", mouseMoveHandler);

    return () => {
      removeEventListener("mousemove", mouseMoveHandler);
    };
  }, [zoom, isPanEnabled, svgRef]);

  const setNormalizedZoom = (zoom: number) => setZoom(normalizeZoom(zoom));
  return { center, setCenter, zoom, setZoom: setNormalizedZoom };
};

const getScaleFactor = (delta: number): number => {
  const scale = delta / 1000;
  if (Math.abs(scale) >= 0.1) {
    return 1 + scale;
  }
  return 1 + delta / 10 / Math.abs(delta || 1);
};
