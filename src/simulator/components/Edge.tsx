import { Position, rotatePosition } from "../model/position";
import { Arrow } from "./Arrow";
import styles from "./Edge.module.css";

const vertexRadius = 19;

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
  const position = (props.position ?? 0) + 3;
  const angle = position * 0.16;

  const start = rotatePosition([vertexRadius, 0], -angle);
  const end = rotatePosition([vertexRadius, 0], angle);

  const mx = vertexRadius + 10 * position;
  const my = Math.tan(angle) * mx;

  const transform = `translate(${props.x} ${props.y}) rotate(45)`;
  const path = getLinePath(start, end, [mx, -my], [mx, my]);

  return (
    <g transform={transform}>
      <path className={styles.line} d={path} />
      {props.directed && <Arrow position={start} angle={Math.PI - angle} />}
    </g>
  );
};

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
