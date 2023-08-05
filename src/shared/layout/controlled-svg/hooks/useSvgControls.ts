import {
  Dispatch,
  RefObject,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";
import { scaleCenterToMatchTarget } from "../helpers/scale";
import { getPointInSvgSpace } from "../helpers/svg";

export type Position = [x: number, y: number];
export type Offset = [x: number, y: number];

export const useSvgControls = (
  svgRef: RefObject<SVGSVGElement>,
  isZoomEnabled?: RefObject<boolean>,
  isPanEnabled?: RefObject<boolean>
): {
  center: Position;
  setCenter: Dispatch<SetStateAction<Position>>;
  zoom: number;
  setZoom: Dispatch<SetStateAction<number>>;
} => {
  const [zoom, setZoom] = useState(1);
  const [center, setCenter] = useState<Position>([0, 0]);

  // Zooming

  useEffect(() => {
    const svgElement = svgRef.current;
    if (!svgElement) {
      return;
    }

    const mouseWheelHandler = (event: WheelEvent) => {
      event.preventDefault();

      if (isZoomEnabled?.current === false) {
        return;
      }

      const scale = getScaleFactor(-event.deltaY);
      setZoom((zoom) => {
        return zoom * scale;
      });

      const mousePosition: Position = [event.clientX, event.clientY];
      // prettier-ignore
      const mousePositionInSVGSpace = getPointInSvgSpace(mousePosition, svgElement);

      setCenter((center) => {
        return scaleCenterToMatchTarget(center, mousePositionInSVGSpace, scale);
      });
    };

    svgElement.addEventListener("wheel", mouseWheelHandler);

    return () => {
      svgElement.removeEventListener("wheel", mouseWheelHandler);
    };
  }, []);

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
  }, []);

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
      const previousMousePosition = previousMousePositionRef.current;
      const currentMousePosition: Position = [event.clientX, event.clientY];
      const delta = [
        currentMousePosition[0] - previousMousePosition[0],
        currentMousePosition[1] - previousMousePosition[1],
      ];
      previousMousePositionRef.current = currentMousePosition;
      setCenter((center) => {
        return [center[0] - delta[0] / zoom, center[1] - delta[1] / zoom];
      });
    };

    svgElement.addEventListener("mousemove", mouseMoveHandler);

    return () => {
      svgElement.removeEventListener("mousemove", mouseMoveHandler);
    };
  }, [zoom]);

  return { center, setCenter, zoom, setZoom };
};

const getScaleFactor = (delta: number): number => {
  const scale = delta / 1000;
  if (Math.abs(scale) >= 0.1) {
    return 1 + scale;
  }
  return 1 + delta / 10 / Math.abs(delta || 1);
};
