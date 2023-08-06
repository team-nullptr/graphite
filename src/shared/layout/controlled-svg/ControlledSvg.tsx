import {
  Dispatch,
  ReactNode,
  RefObject,
  SetStateAction,
  forwardRef,
  useRef,
} from "react";
import { combineRefs } from "~/features/graph-view/helpers/combineRefs";
import { useResizeObserver } from "./hooks/useResizeObserver";
import { Position, useSvgControls } from "./hooks/useSvgControls";
import { cn } from "~/lib/utils";

export type ControllableSvgControls = (
  zoom: number,
  center: Position,
  setZoom: (zoom: number) => void,
  setCenter: (center: Position) => void
) => ReactNode;

export interface ControllableSvgProps {
  controls?: ControllableSvgControls;
  children?: ReactNode;
  isZoomEnabled?: RefObject<boolean>;
  isPanEnabled?: RefObject<boolean>;
  className?: string;
}

export const ControlledSvg = forwardRef<SVGSVGElement, ControllableSvgProps>(
  (props, ref) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const svgRef = useRef<SVGSVGElement>(null);

    const containerRect = useResizeObserver(containerRef);

    // prettier-ignore
    const { center, setCenter, zoom, setZoom } = useSvgControls(svgRef, props.isZoomEnabled, props.isPanEnabled);
    const viewBox = getViewBox(containerRect, center, zoom);

    return (
      <div
        ref={containerRef}
        className={cn("relative select-none overflow-hidden", props.className)}
      >
        <div className="pointer-events-none absolute left-0 top-0 flex h-full w-full flex-col-reverse items-end p-4">
          {props.controls?.(zoom, center, setZoom, setCenter)}
        </div>
        <svg
          ref={combineRefs(svgRef, ref)}
          style={{ width: containerRect.width, height: containerRect.height }}
          className="h-full w-full"
          viewBox={viewBox.join(" ")}
        >
          {props.children}
        </svg>
      </div>
    );
  }
);

export type ViewBox = [x: number, y: number, w: number, h: number];

const getViewBox = (
  containerRect: DOMRect,
  center: Position,
  zoom: number
): ViewBox => {
  const { width: containerWidth, height: containerHeight } = containerRect;

  const viewportWidth = containerWidth / zoom;
  const viewportHeight = containerHeight / zoom;

  const viewportX = -viewportWidth / 2 + center[0];
  const viewportY = -viewportHeight / 2 + center[1];

  return [viewportX, viewportY, viewportWidth, viewportHeight];
};
