import { PropsWithChildren, ReactNode, RefObject, forwardRef, useRef } from "react";
import { combineRefs } from "~/features/graph-view/helpers/combineRefs";
import { useResizeObserver } from "./hooks/useResizeObserver";
import { Position, ZoomBounds, useSvgControls } from "./hooks/useSvgControls";
import { cn } from "~/lib/utils";

export type ControllableSvgControls = (controls: {
  zoom: number;
  center: Position;
  setZoom: (zoom: number) => void;
  setCenter: (center: Position) => void;
}) => ReactNode;

export type ControllableSvgProps = PropsWithChildren<{
  controls?: ControllableSvgControls;
  zoomBounds: ZoomBounds;
  isZoomEnabled?: RefObject<boolean>;
  isPanEnabled?: RefObject<boolean>;
  className?: string;
}>;

export const ControlledSvg = forwardRef<SVGSVGElement, ControllableSvgProps>(
  ({ controls, isZoomEnabled, isPanEnabled, zoomBounds, className, children }, ref) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const svgRef = useRef<SVGSVGElement>(null);

    const containerRect = useResizeObserver(containerRef);
    const { center, setCenter, zoom, setZoom } = useSvgControls(svgRef, {
      isZoomEnabled,
      isPanEnabled,
      zoomBounds,
    });
    const viewBox = getViewBox(containerRect, center, zoom);

    return (
      <div ref={containerRef} className={cn("relative select-none overflow-hidden", className)}>
        <div className="pointer-events-none absolute left-0 top-0 flex h-full w-full flex-col-reverse items-end p-4">
          {controls?.({ zoom, center, setZoom, setCenter })}
        </div>
        <svg
          ref={combineRefs(svgRef, ref)}
          className="h-full w-full"
          viewBox={viewBox.join(" ")}
          style={{
            width: containerRect.width,
            height: containerRect.height,
          }}
        >
          {children}
        </svg>
      </div>
    );
  }
);

export type ViewBox = [x: number, y: number, w: number, h: number];

const getViewBox = (containerRect: DOMRect, center: Position, zoom: number): ViewBox => {
  const { width: containerWidth, height: containerHeight } = containerRect;

  const viewportWidth = containerWidth / zoom;
  const viewportHeight = containerHeight / zoom;

  const viewportX = -viewportWidth / 2 + center[0];
  const viewportY = -viewportHeight / 2 + center[1];

  return [viewportX, viewportY, viewportWidth, viewportHeight];
};
