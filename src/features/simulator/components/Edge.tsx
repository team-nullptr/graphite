import { Position, rotatePosition } from "../model/position";
import { Arrow } from "./Arrow";
import styles from "./Edge.module.css";

const vertexRadius = 19;

export interface EdgeProps {
  x: number;
  y: number;
  dx: number;
  dy: number;
  directed?: boolean;
  position?: number;
  circular?: boolean;
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

  const start = rotatePosition([vertexRadius, 0], angle);
  const end = rotatePosition([length - vertexRadius, 0], -angle, [length, 0]);

  const mx = (start[0] + end[0]) / 2;
  const my = Math.tan(angle) * mx;

  const rad = Math.atan2(height, width);
  const deg = (rad * 180) / Math.PI;

  const transform = `translate(${props.x} ${props.y}) rotate(${deg})`;
  const path = getLinePath(start, end, [mx, my]);

  return (
    <g transform={transform}>
      <path className={styles.line} d={path} />
      {props.directed && <Arrow position={end} angle={-angle} />}
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
  const arrowPostion: Position = [arrowX, arrowY];
  // TODO: Replace 1.2 with actual calculations, to determine the right angle
  // This is due to how arrows are drawn (rotated)
  const arrowAngle = Math.atan2(cy - arrowY, cx - arrowX) * 1.2 - Math.PI / 2;

  const transform = `translate(${props.x} ${props.y}) rotate(45)`;

  return (
    <g transform={transform}>
      <circle className={styles.line} cx={cx} cy={cy} r={radius} />
      {props.directed && <Arrow position={arrowPostion} angle={arrowAngle} />}
    </g>
  );
};

const getLinePath = (
  start: Position,
  end: Position,
  a: Position,
  b?: Position
): string => {
  const [sx, sy] = start;
  const [ex, ey] = end;
  const [ax, ay] = a;

  if (!b) {
    return `M${sx} ${sy}Q${ax} ${ay} ${ex} ${ey}`;
  }

  const [bx, by] = b;
  return `M${sx} ${sy}C${ax} ${ay},${bx} ${by},${ex} ${ey}`;
};