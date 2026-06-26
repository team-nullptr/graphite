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
  name?: string;
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
  name,
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
      {name && <EdgeLabel text={name} position={edgeLabelPosition} angle={-deg} />}
      {directed && <Arrow position={end} angle={-angle} color={color} />}
    </g>
  );
}

const getPathCenter = (path: SVGPathElement) => {
  const length = path.getTotalLength();
  const centerPoint = path.getPointAtLength(length / 2);
  return new Vec2(centerPoint.x, centerPoint.y);
};

const CircularEdge = ({ x, y, directed, position = 0, color = "slate", name }: EdgeProps) => {
  const radius = 6 * position + 16;
  const cx = radius + vertexRadius / 1.61;
  const transform = `translate(${x} ${y}) rotate(65)`;
  const stroke = colors[color][400];

  const edgeLabelPosition = new Vec2(cx + radius, 0);

  const arrowPosition = vertexAndCircularEdgeIntersection(vertexRadius, cx, radius);
  // TODO: Replace 1.3 with actual calculations, to determine the right angle
  // This is due to how arrows are drawn (rotated)
  const arrowAngle = Math.atan2(0 - arrowPosition.y, cx - arrowPosition.x) * 1.3 - Math.PI / 2;

  return (
    <g transform={transform}>
      <circle
        className="fill-none stroke-1 transition-[stroke]"
        cx={cx}
        cy={0}
        r={radius}
        stroke={stroke}
      />
      {name && <EdgeLabel text={name} position={edgeLabelPosition} angle={-90} />}
      {directed && <Arrow position={arrowPosition} angle={arrowAngle} color={color} />}
    </g>
  );
};

const vertexAndCircularEdgeIntersection = (r1: number, a2: number, r2: number): Vec2 => {
  // -2ax + a^2 = j^2 - k^2
  const x = a2 / 2 + (r1 ** 2 - r2 ** 2) / (2 * a2);
  const y = Math.sqrt(r1 ** 2 - x ** 2);
  return new Vec2(x, y);
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

  return (
    <>
      {/* prettier-ignore */}
      <circle
        cx={x}
        cy={y}
        r={16}
        fill="url(#edgeLabelGradient)" />
      <text
        ref={labelTextRef}
        x={x}
        y={y}
        dominantBaseline="central"
        textAnchor="middle"
        fontSize={14}
        transform={`rotate(${props.angle})`}
        transform-origin={`${x} ${y}`}
      >
        {props.text}
      </text>
    </>
  );
};
