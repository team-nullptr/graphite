import styles from "./Vertex.module.css";

export interface VertexProps {
  cx: number;
  cy: number;
  value: string;
}

export const Vertex = (props: VertexProps) => {
  return (
    <g className={styles.vertex}>
      <circle cx={props.cx} cy={props.cy} r={19} />
      <text x={props.cx} y={props.cy}>
        {props.value}
      </text>
    </g>
  );
};
