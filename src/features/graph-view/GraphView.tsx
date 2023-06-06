import { useMemo } from "react";
import { Edge } from "./components/Edge";
import { Vertex } from "./components/Vertex";
import { useArrangement } from "./hooks/useArrangement";
import { distributeEdges, groupEdges, sortEdges } from "./util/distributeEdges";
import { useEditorStore } from "../editor/context/editor";
import { Highlights } from "../../engine/runner/instruction";

export type GraphViewProps = {
  highlights?: Highlights;
};

export const GraphView = (props: GraphViewProps) => {
  const graph = useEditorStore((state) => state.graph);
  const { arrangement, vertexMouseDownHandler, svgRef } = useArrangement();

  const positionedEdges = useMemo(() => {
    const connections = groupEdges(Object.values(graph.edges));

    return connections.map((connection) => {
      const [vertex, edges] = connection;
      const sortedEdges = sortEdges(edges, vertex);
      return distributeEdges(sortedEdges, vertex);
    });
  }, [graph]);

  const renderVertices = () =>
    Object.values(graph.vertices).map((vertex) => {
      const [x, y] = arrangement[vertex.id] ?? [0, 0];
      const { id } = vertex;
      const hue = props.highlights?.get(id);

      return (
        <Vertex
          hue={hue}
          key={id}
          cx={x}
          cy={y}
          value={id}
          onMouseDown={(offset) => vertexMouseDownHandler(vertex, offset)}
        />
      );
    });

  const renderEdges = () =>
    positionedEdges.flat().map((positionedEdge) => {
      const [edge, position] = positionedEdge;
      const [x, y] = arrangement[edge.from] ?? [0, 0];
      const [dx, dy] = arrangement[edge.to] ?? [0, 0];
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
    });

  return (
    <svg
      ref={svgRef}
      className="h-full w-full bg-base-200 dark:bg-base-300-dark"
    >
      {renderEdges()}
      {renderVertices()}
    </svg>
  );
};
