import { MouseEvent, useRef } from "react";
import { Position } from "../model/position";
import styles from "./Vertex.module.css";

export interface VertexProps {
  cx: number;
  cy: number;
  value: string;
  onMouseDown?: (offset: Position) => void;
  hue?: number;
}

export const Vertex = (props: VertexProps) => {
  const ref = useRef<SVGGElement>(null);

  const mouseDownHandler = (event: MouseEvent) => {
    const boundingBox = ref.current?.getBoundingClientRect();
    if (!boundingBox) return;

    const offsetX = event.pageX - boundingBox.left - 19;
    const offsetY = event.pageY - boundingBox.top - 19;

    const offset: Position = [offsetX, offsetY];
    props.onMouseDown?.(offset);
  };

  // prettier-ignore
  const fill =
    props.hue !== undefined
      ? `hsl(${props.hue}, 50%, 90%)`
      : "rgb(247, 247, 247)";
  const stroke =
    props.hue !== undefined
      ? `hsl(${props.hue}, 50%, 65%)`
      : "rgb(175, 175, 175)";

  return (
    <g ref={ref} className={styles.vertex} onMouseDown={mouseDownHandler}>
      <circle cx={props.cx} cy={props.cy} r={19} fill={fill} stroke={stroke} />
      <text x={props.cx} y={props.cy}>
        {props.value}
      </text>
    </g>
  );
};
