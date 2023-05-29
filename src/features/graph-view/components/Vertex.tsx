import { MouseEvent, useRef } from "react";
import { Position } from "../model/position";

export type VertexProps = {
  cx: number;
  cy: number;
  value: string;
  onMouseDown?: (offset: Position) => void;
  hue?: number;
};

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

  const fillColor =
    props.hue !== undefined
      ? `hsl(${props.hue}, 80%, 80%)`
      : "rgb(247, 247, 247)";

  const strokeColor =
    props.hue !== undefined
      ? `hsl(${props.hue}, 50%, 65%)`
      : "rgb(175, 175, 175)";

  const textColor =
    props.hue !== undefined ? `hsl(${props.hue}, 50%, 30%)` : "rgb(0, 0, 0)";

  return (
    <g ref={ref} className="font-[JetBrains]" onMouseDown={mouseDownHandler}>
      <circle
        className="stroke-1 transition-[fill,_stroke]"
        cx={props.cx}
        cy={props.cy}
        r={19}
        fill={fillColor}
        stroke={strokeColor}
      />
      <text
        className="transition-[fill] [dominant-baseline:central] [text-anchor:middle]"
        x={props.cx}
        y={props.cy}
        fill={textColor}
      >
        {props.value}
      </text>
    </g>
  );
};
