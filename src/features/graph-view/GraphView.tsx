import { useMemo } from "react";
import { Edge } from "./components/Edge";
import { Vertex } from "./components/Vertex";
import { distributeEdges, groupEdges, sortEdges } from "./util/distributeEdges";
import { useEditorStore } from "../editor/context/editor";
import { Highlights } from "../../engine/runner/instruction";
import { useForceDirectedLayout } from "./hooks/useForceDirectedLayout";

export type GraphViewProps = {
  highlights?: Highlights;
};

export const GraphView = ({ highlights }: GraphViewProps) => {
  const graph = useEditorStore((state) => state.graph);
  const { arrangement, svgRef, vertexMouseDownHandler } =
    useForceDirectedLayout(graph);

  const positionedEdges = useMemo(
    () =>
      groupEdges(Object.values(graph.edges)).map((connection) => {
        const [vertex, edges] = connection;
        const sortedEdges = sortEdges(edges, vertex);
        return distributeEdges(sortedEdges, vertex);
      }),
    [graph]
  );

  const vertices = useMemo(
    () =>
      Object.entries(arrangement).map(([id, pos]) => {
        const { x, y } = pos;
        const hue = highlights?.get(id);

        return (
          <Vertex
            hue={hue}
            key={id}
            cx={x}
            cy={y}
            value={id}
            onMouseDown={(offset) => vertexMouseDownHandler(id, offset)}
          />
        );
      }),
    [arrangement, highlights, vertexMouseDownHandler]
  );

  const edges = useMemo(
    () =>
      positionedEdges.flat().map((positionedEdge) => {
        const [edge, position] = positionedEdge;
        const { x, y } = arrangement[edge.from];
        const { x: dx, y: dy } = arrangement[edge.to];
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
      }),
    [arrangement, positionedEdges]
  );

  return (
    <svg
      ref={svgRef}
      className="h-full w-full bg-base-200 dark:bg-base-300-dark"
    >
      {edges}
      {vertices}
    </svg>
  );
};
