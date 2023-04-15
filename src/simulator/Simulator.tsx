import { Graph } from "../core/models/Graph";
import styles from "./Simulator.module.css";

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
        return <Edge key={edge.id} x={x} y={y} dx={dx} dy={dy} />;
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

interface EdgeProps {
  x: number;
  y: number;
  dx: number;
  dy: number;
}

const Edge = (props: EdgeProps) => {
  return (
    <line
      className={styles.edge}
      x1={props.x}
      y1={props.y}
      x2={props.dx}
      y2={props.dy}
    />
  );
};

interface VertexProps {
  cx: number;
  cy: number;
  value: string;
}

const Vertex = (props: VertexProps) => {
  return (
    <g className={styles.vertex}>
      <circle cx={props.cx} cy={props.cy} r={19} />
      <text x={props.cx} y={props.cy}>
        {props.value}
      </text>
    </g>
  );
};
