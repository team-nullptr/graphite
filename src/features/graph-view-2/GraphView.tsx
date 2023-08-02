import { useRef } from "react";
import { Graph } from "~/core/simulator/graph";

export interface GraphViewProps {
  graph: Graph;
}

export const GraphView = (props: GraphViewProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  return (
    <div ref={containerRef} className="select-none overflow-hidden">
      <svg ref={svgRef}>
        <rect x={10} y={10} width={20} height={20} fill="red" />
      </svg>
    </div>
  );
};
