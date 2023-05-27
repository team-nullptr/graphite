import { useMemo } from "react";
import { Edge } from "./components/Edge";
import { Vertex } from "./components/Vertex";
import { useArrangement } from "./hooks/useArrangement";
import { Position } from "./model/position";
import { distributeEdges, groupEdges, sortEdges } from "./util/distributeEdges";
import { useEditorStore } from "../editor/context/editor";

export type Arrangement = { [key: string]: Position };

export const GraphView = () => {
  const graph = useEditorStore((state) => state.graph);
  const { arrangement, vertexMouseDownHandler, svgRef } = useArrangement();

  const positionedEdges = useMemo(() => {
    const connections = groupEdges(graph.edges);

    return connections.map((connection) => {
      const [vertex, edges] = connection;
      const sortedEdges = sortEdges(edges, vertex);
      return distributeEdges(sortedEdges, vertex);
    });
  }, [graph]);

  const renderVertices = () =>
    graph.vertices.map((vertex) => {
      const [x, y] = arrangement[vertex.id] ?? [0, 0];
      const { id, value } = vertex;
      return (
        <Vertex
          key={id}
          cx={x}
          cy={y}
          value={value.toString()}
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
