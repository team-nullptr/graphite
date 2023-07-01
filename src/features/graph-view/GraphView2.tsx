import { useEffect, useRef, useState } from "react";
import { useResizeObserver } from "./hooks/useResizeObserver";
import { useZoom } from "./hooks/useZoom";
import { usePan } from "./hooks/usePan";

export interface GraphViewProps {
  className: string;
}

type Viewport = [x: number, y: number, width: number, height: number];

export const GraphView = (props: GraphViewProps) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const containerRect = useResizeObserver(containerRef);

  const [viewport, setViewport] = useState<Viewport>([0, 0, 0, 0]);

  useEffect(() => {
    if (!containerRect) return;

    const { width, height } = containerRect;
    setViewport([0, 0, width, height]);
  }, [containerRect]);

  // TODO: This looks weird, maybe do something about it,
  // like change what resize observer returns?
  const containerDimen = [
    containerRect?.width ?? 0,
    containerRect?.height ?? 0,
  ] satisfies [number, number];

  usePan(svgRef, containerDimen, setViewport, { current: true });
  useZoom(svgRef, setViewport);

  return (
    <>
      <div ref={containerRef} className={props.className + " overflow-hidden"}>
        <svg
          ref={svgRef}
          className="h-full w-full"
          viewBox={viewport.join(" ")}
        >
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
