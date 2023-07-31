import { useEffect, useMemo, useRef, useState } from "react";
import { Graph } from "~/core/simulator/graph";
import { Highlights } from "~/core/simulator/algorithm";
import { Edge } from "./components/Edge";
import { Vertex } from "./components/Vertex";
import {
  distributeEdges,
  groupEdges,
  sortEdges,
} from "./helpers/distributeEdges";
import { useGraphLayout } from "./hooks/useGraphLayout";
import { usePan } from "./hooks/usePan";
import { useResizeObserver } from "./hooks/useResizeObserver";
import { useZoom } from "./hooks/useZoom";
import { useSvgControls } from "./hooks/useSvgControls";

type Viewport = [x: number, y: number, width: number, height: number];

export type GraphViewProps = {
  highlights?: Highlights;
  className: string;
  graph: Graph;
};

export const GraphView = ({ className, highlights, graph }: GraphViewProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  const { arrangement, vertexMouseDownHandler, areControlsEnabled } =
    useGraphLayout(graph, svgRef);

  const viewport = useSvgControls(containerRef, svgRef, areControlsEnabled);

  const positionedEdges = useMemo(
    () =>
      groupEdges(Object.values(graph.edges))
        .map((connection) => {
          const [vertex, edges] = connection;
          const sortedEdges = sortEdges(edges, vertex);
          return distributeEdges(sortedEdges, vertex);
        })
        .flat(),
    [graph]
  );

  const vertices = Object.entries(arrangement);
  const viewBox = viewport.join(" ");

  return (
    <>
      <div
        ref={containerRef}
        className={className + " select-none overflow-hidden"}
      >
        <svg ref={svgRef} className="h-full w-full" viewBox={viewBox}>
          {/* Edges */}
          {positionedEdges.map((positionedEdge) => {
            const [edge, position] = positionedEdge;
            const { x, y } = arrangement[edge.from] ?? { x: 0, y: 0 };
            const { x: dx, y: dy } = arrangement[edge.to] ?? { x: 0, y: 0 };
            const circular = edge.from === edge.to;

            return (
              <Edge
                key={edge.id}
                position={position}
                x={x}
                y={y}
                dx={dx}
                dy={dy}
                directed={edge.directed}
                circular={circular}
              />
            );
          })}

          {/* Vertices */}
          {vertices.map(([id, pos]) => {
            const { x, y } = pos;
            const color = highlights?.get(id);
            return (
              <Vertex
                key={id}
                color={color}
                cx={x}
                cy={y}
                value={id}
                onMouseDown={(event) => vertexMouseDownHandler(id, event)}
              />
            );
          })}
        </svg>
      </div>
    </>
  );
};
