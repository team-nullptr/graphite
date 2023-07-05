import { useEffect, useRef } from "react";

export type VertexProps = {
  cx: number;
  cy: number;
  value: string;
  onMouseDown?: (event: MouseEvent) => void;
  hue?: number;
};

export const Vertex = (props: VertexProps) => {
  const ref = useRef<SVGGElement>(null);

  useEffect(() => {
    const vertexElement = ref.current;
    if (!vertexElement) return;

    const mouseDownHandler = props.onMouseDown;
    if (!mouseDownHandler) return;

    // Registering mousedown event this way is crucial for the app to function properly.
    // The addEventListener method allows for passing the options argument,
    // which will force the event to be delivered in the earlier phase (capture phase)
    vertexElement.addEventListener("mousedown", mouseDownHandler, true);
    return () => {
      vertexElement.removeEventListener("mousedown", mouseDownHandler);
    };
  }, [props.onMouseDown]);

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
    <g ref={ref} className="font-[JetBrains]">
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
