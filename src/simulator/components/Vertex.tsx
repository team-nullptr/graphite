import { MouseEvent, useRef } from "react";
import { Position } from "../model/position";
import styles from "./Vertex.module.css";

export interface VertexProps {
  cx: number;
  cy: number;
  value: string;
  onMouseDown?: (offset: Position) => void;
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

  return (
    <g ref={ref} className={styles.vertex} onMouseDown={mouseDownHandler}>
      <circle cx={props.cx} cy={props.cy} r={19} />
      <text x={props.cx} y={props.cy}>
        {props.value}
      </text>
    </g>
  );
};
