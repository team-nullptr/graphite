import { useRef } from "react";
import colors from "tailwindcss/colors";
import { cn } from "~/lib/utils";
import type { Color } from "~/types/color";
import { Vec2 } from "../types/vec2";
import { Arrow } from "./Arrow";

const vertexRadius = 19;

export type EdgeProps = {
  x: number;
  y: number;
  dx: number;
  dy: number;
  color?: Color;
  directed?: boolean;
  position?: number;
  circular?: boolean;
  thicken?: boolean;
  weight?: number;
};

export function Edge(props: EdgeProps) {
  if (props.circular) return <CircularEdge {...props} />;
  return <StraightEdge {...props} />;
}

function StraightEdge({
  x,
  y,
  dx,
  dy,
  directed,
  color = "slate",
  thicken = false,
  position = 0,
  weight,
}: EdgeProps) {
  const edgePathRef = useRef<SVGPathElement>(null);

  const width = dx - x;
  const height = dy - y;
  const length = Math.sqrt(Math.pow(width, 2) + Math.pow(height, 2));

  const angle = position * 0.25;

  const start = new Vec2(vertexRadius, 0).rotate(angle);
  const end = new Vec2(length - vertexRadius, 0).rotate(-angle, new Vec2(length, 0));

  const mx = (start.x + end.x) / 2;
  const my = Math.tan(angle) * mx;

  const rad = Math.atan2(height, width);
  const deg = (rad * 180) / Math.PI;

  const transform = `translate(${x} ${y}) rotate(${deg})`;
  const path = getLinePath(start, end, new Vec2(mx, my));

  const stroke = colors[color][400];

  const pathElement = edgePathRef.current;
  const edgeLabelPosition = pathElement ? getPathCenter(pathElement) : new Vec2(0, 0);

  return (
    <g transform={transform}>
      <path
        ref={edgePathRef}
        className={cn("fill-none stroke-1 transition-[stroke]", thicken && "stroke-[3px]")}
        d={path}
        stroke={stroke}
      />
      {weight && <EdgeLabel text={weight.toString()} position={edgeLabelPosition} angle={-deg} />}
      {directed && <Arrow position={end} angle={-angle} color={color} />}
    </g>
  );
}

const getPathCenter = (path: SVGPathElement) => {
  const length = path.getTotalLength();
  const centerPoint = path.getPointAtLength(length / 2);
  return new Vec2(centerPoint.x, centerPoint.y);
};

const CircularEdge = ({ x, y, directed, position = 0, color = "slate", weight }: EdgeProps) => {
  const radius = 6 * position + 15;

  const [cx, cy] = [radius + vertexRadius / 1.61, 0];

  // Intersection of two rounds - the vertex and the edge
  const arrowX = vertexRadius - radius ** 2 / (2 * vertexRadius);
  const arrowY = Math.sqrt(vertexRadius ** 2 - arrowX ** 2);
  const arrowPosition: Vec2 = new Vec2(arrowX, arrowY);

  // TODO: Replace 1.2 with actual calculations, to determine the right angle
  // This is due to how arrows are drawn (rotated)
  const arrowAngle = Math.atan2(cy - arrowY, cx - arrowX) * 1.2 - Math.PI / 2;

  const transform = `translate(${x} ${y}) rotate(65)`;
  const stroke = colors[color][400];

  const edgeLabelPosition = new Vec2(cx + radius, 0);

  return (
    <g transform={transform}>
      <circle
        className="fill-none stroke-1 transition-[stroke]"
        cx={cx}
        cy={cy}
        r={radius}
        stroke={stroke}
      />
      {weight && <EdgeLabel text={weight.toString()} position={edgeLabelPosition} angle={-90} />}
      {directed && <Arrow position={arrowPosition} angle={arrowAngle} color={color} />}
    </g>
  );
};

const getLinePath = (
  { x: sx, y: sy }: Vec2,
  { x: ex, y: ey }: Vec2,
  { x: ax, y: ay }: Vec2,
  b?: Vec2
): string => {
  if (!b) {
    return `M${sx} ${sy}Q${ax} ${ay} ${ex} ${ey}`;
  }

  const { x: bx, y: by } = b;

  return `M${sx} ${sy}C${ax} ${ay},${bx} ${by},${ex} ${ey}`;
};

interface EdgeTextProps {
  text: string;
  position: Vec2;
  angle: number;
}

const EdgeLabel = (props: EdgeTextProps) => {
  const labelTextRef = useRef<SVGTextElement>(null);

  const { x, y } = props.position;
  // TODO: Consider using this without a background: y + 5 * (props.angle > 0 ? -1 : 1);

  const labelTextBBox = labelTextRef.current?.getBBox();
  const labelTextWidth = labelTextBBox?.width ?? 0;
  const labelTextHeight = labelTextBBox?.height ?? 0;

  return (
    <g transform={`rotate(${props.angle})`} transform-origin={`${x} ${y}`}>
      <line
        x1={x - labelTextWidth / 2}
        y1={y}
        x2={x + labelTextWidth / 2}
        y2={y}
        stroke="#e4e7eb"
        strokeWidth={labelTextHeight}
        strokeLinecap="round"
      />
      <text
        ref={labelTextRef}
        x={x}
        y={y}
        dominantBaseline="central"
        textAnchor="middle"
        fontSize={12}
      >
        {props.text}
      </text>
    </g>
  );
};
