import { useMemo, useRef } from "react";
import { Highlights } from "~/core/simulator/algorithm";
import { Graph } from "~/core/simulator/graph";
import { Edge } from "./components/Edge";
import { Vertex } from "./components/Vertex";
import {
  distributeEdges,
  groupEdges,
  sortEdges,
} from "./helpers/distributeEdges";
import { useGraphLayout } from "./hooks/useGraphLayout";
import { ControlledSvg } from "~/shared/layout/controlled-svg/ControlledSvg";

export type GraphViewProps = {
  highlights?: Highlights;
  className: string;
  graph: Graph;
};

export const GraphView = ({ className, highlights, graph }: GraphViewProps) => {
  const svgRef = useRef<SVGSVGElement>(null);

  const { arrangement, vertexMouseDownHandler, areControlsEnabled } =
    useGraphLayout(graph, svgRef);

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

  return (
    <ControlledSvg>
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
      {Object.entries(arrangement).map(([id, pos]) => {
        const { x, y } = pos;
        const color = highlights?.get(id);

        return (
          <Vertex
            key={id}
            color={color}
            cx={x}
            cy={y}
            value={id}
            onMouseDown={(event) => {
              console.log(event.button);
              if (event.button === 0) {
                vertexMouseDownHandler(id, event);
              }
            }}
          />
        );
      })}
    </ControlledSvg>
  );
};
