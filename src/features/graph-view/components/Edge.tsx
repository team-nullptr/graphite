import type { Color } from "~/types/color";
import { Vec2 } from "../types/vec2";
import { Arrow } from "./Arrow";
import colors from "tailwindcss/colors";
import { cn } from "~/lib/utils";

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
}: EdgeProps) {
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

  return (
    <g transform={transform}>
      <path
        className={cn("fill-none stroke-1 transition-[stroke]", thicken && "stroke-[3px]")}
        d={path}
        stroke={stroke}
      />
      {directed && <Arrow position={end} angle={-angle} color={color} />}
    </g>
  );
}

const CircularEdge = ({ x, y, directed, position = 0, color = "slate" }: EdgeProps) => {
  const radius = 6 * position + 15;

  const [cx, cy] = [vertexRadius, 0];

  // Intersection of two rounds - the vertex and the edge
  const arrowX = vertexRadius - radius ** 2 / (2 * vertexRadius);
  const arrowY = Math.sqrt(vertexRadius ** 2 - arrowX ** 2);
  const arrowPostion: Vec2 = new Vec2(arrowX, arrowY);

  // TODO: Replace 1.2 with actual calculations, to determine the right angle
  // This is due to how arrows are drawn (rotated)
  const arrowAngle = Math.atan2(cy - arrowY, cx - arrowX) * 1.2 - Math.PI / 2;

  const transform = `translate(${x} ${y}) rotate(45)`;
  const stroke = colors[color][500];

  return (
    <g transform={transform}>
      <circle
        className="fill-none stroke-1 transition-[stroke]"
        cx={cx}
        cy={cy}
        r={radius}
        stroke={stroke}
      />
      {directed && <Arrow position={arrowPostion} angle={arrowAngle} color={color} />}
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
