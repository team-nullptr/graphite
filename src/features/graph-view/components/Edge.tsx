import { Vec2 } from "../model/vec2";
import { Arrow } from "./Arrow";

const vertexRadius = 19;

export interface EdgeProps {
  x: number;
  y: number;
  dx: number;
  dy: number;
  directed?: boolean;
  position?: number;
  circular?: boolean;
  hue?: number;
}

export const Edge = (props: EdgeProps) => {
  if (props.circular) return <CircularEdge {...props} />;
  return <StraightEdge {...props} />;
};

const StraightEdge = (props: EdgeProps) => {
  const width = props.dx - props.x;
  const height = props.dy - props.y;
  const length = Math.sqrt(Math.pow(width, 2) + Math.pow(height, 2));

  const position = props.position ?? 0;
  const angle = position * 0.25;

  const start = new Vec2([vertexRadius, 0]).rotate(angle);
  const end = new Vec2([length - vertexRadius, 0]).rotate(
    -angle,
    new Vec2([length, 0])
  );

  const mx = (start.x + end.x) / 2;
  const my = Math.tan(angle) * mx;

  const rad = Math.atan2(height, width);
  const deg = (rad * 180) / Math.PI;

  const transform = `translate(${props.x} ${props.y}) rotate(${deg})`;
  const path = getLinePath(start, end, new Vec2([mx, my]));

  const stroke =
    props.hue !== undefined
      ? `hsl(${props.hue}, 50%, 65%)`
      : "rgb(175, 175, 175)";

  return (
    <g transform={transform}>
      <path
        className="fill-none stroke-1 transition-[stroke]"
        d={path}
        stroke={stroke}
      />
      {props.directed && (
        <Arrow position={end} angle={-angle} hue={props.hue} />
      )}
    </g>
  );
};

const CircularEdge = (props: EdgeProps) => {
  const position = props.position ?? 0;
  const radius = 6 * position + 15;

  const [cx, cy] = [vertexRadius, 0];

  // Intersection of two rounds - the vertex and the edge
  const arrowX = vertexRadius - radius ** 2 / (2 * vertexRadius);
  const arrowY = Math.sqrt(vertexRadius ** 2 - arrowX ** 2);
  const arrowPostion: Vec2 = new Vec2([arrowX, arrowY]);

  // TODO: Replace 1.2 with actual calculations, to determine the right angle
  // This is due to how arrows are drawn (rotated)
  const arrowAngle = Math.atan2(cy - arrowY, cx - arrowX) * 1.2 - Math.PI / 2;

  const transform = `translate(${props.x} ${props.y}) rotate(45)`;

  const stroke =
    props.hue !== undefined
      ? `hsl(${props.hue}, 50%, 65%)`
      : "rgb(175, 175, 175)";

  return (
    <g transform={transform}>
      <circle
        className="fill-none stroke-1 transition-[stroke]"
        cx={cx}
        cy={cy}
        r={radius}
        stroke={stroke}
      />
      {props.directed && (
        <Arrow position={arrowPostion} angle={arrowAngle} hue={props.hue} />
      )}
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
