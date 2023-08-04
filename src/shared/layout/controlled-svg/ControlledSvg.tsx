import { Dispatch, Fragment, SetStateAction, useRef } from "react";
import { useResizeObserver } from "./hooks/useResizeObserver";
import { Position, useSvgControls } from "./hooks/useSvgControls";

export type ControllableSvgControls = (
  zoom: number,
  center: Position,
  setZoom: Dispatch<SetStateAction<number>>,
  setCenter: Dispatch<SetStateAction<Position>>
) => JSX.Element | JSX.Element[];

export interface ControllableSvgProps {
  controls?: ControllableSvgControls;
  children?: JSX.Element | JSX.Element[];
}

export const ControlledSvg = (props: ControllableSvgProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  const containerRect = useResizeObserver(containerRef);

  const { center, setCenter, zoom, setZoom } = useSvgControls(svgRef);
  const viewBox = getViewBox(containerRect, center, zoom);

  return (
    <div
      ref={containerRef}
      className="relative h-full w-full select-none overflow-hidden"
    >
      <div className="pointer-events-none absolute left-0 top-0 h-full w-full">
        {props.controls?.(zoom, center, setZoom, setCenter)}
      </div>
      <svg ref={svgRef} viewBox={viewBox.join(" ")}>
        {props.children}
      </svg>
    </div>
  );
};

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
