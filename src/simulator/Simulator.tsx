import { Graph } from "../core/models/Graph";
import styles from "./Simulator.module.css";
import { Edge } from "./components/Edge";
import { Vertex } from "./components/Vertex";

export type Position = [x: number, y: number];

export interface SimulatorProps {
  graph: Graph<unknown, unknown>;
  arrangement: { [key: string]: Position };
}

export const Simulator = (props: SimulatorProps) => {
  return (
    <svg className={styles.simulator}>
      {props.graph.edges.map((edge) => {
        const [x, y] = props.arrangement[edge.a] ?? [0, 0];
        const [dx, dy] = props.arrangement[edge.b] ?? [0, 0];
        // prettier-ignore
        return <Edge key={edge.id} x={x} y={y} dx={dx} dy={dy} directed={edge.directed} />;
      })}
      {props.graph.vertices.map((vertex) => {
        const [x, y] = props.arrangement[vertex.id] ?? [0, 0];
        return (
          <Vertex key={vertex.id} cx={x} cy={y} value={vertex.value as any} />
        );
      })}
    </svg>
  );
};
