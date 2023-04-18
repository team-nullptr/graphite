import { useMemo } from "react";
import styles from "./Simulator.module.css";
import { Edge } from "./components/Edge";
import { Vertex } from "./components/Vertex";
import { positionEdges } from "./util/positionEdges";
import { Graph } from "../engine/graph";

export type Position = [x: number, y: number];
export type Arrangement = { [key: string]: Position };

export interface SimulatorProps {
  graph: Graph;
  arrangement: Arrangement;
}

export const Simulator = ({ graph, arrangement }: SimulatorProps) => {
  const positionedEdges = useMemo(() => {
    return positionEdges(graph.edges);
  }, [graph]);

  const renderEdges = () =>
    positionedEdges.map((positionedEdge) => {
      const [edge, position] = positionedEdge;

      const [x, y] = arrangement[edge.a.id] ?? [0, 0];
      const [dx, dy] = arrangement[edge.b.id] ?? [0, 0];

      return (
        <Edge
          key={edge.id}
          position={position}
          x={x}
          y={y}
          dx={dx}
          dy={dy}
          directed={edge.directed}
        />
      );
    });

  const renderVertices = () =>
    graph.vertices.map((vertex) => {
      const [x, y] = arrangement[vertex.id] ?? [0, 0];

      return (
        <Vertex key={vertex.id} cx={x} cy={y} value={vertex.value as any} />
      );
    });

  return (
    <svg className={styles.simulator}>
      {renderEdges()}
      {renderVertices()}
    </svg>
  );
};
