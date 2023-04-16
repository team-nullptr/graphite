import { Position } from "../Simulator";
import styles from "./Edge.module.css";

const vertexRadius = 20;

export interface EdgeProps {
  x: number;
  y: number;
  dx: number;
  dy: number;
  directed?: boolean;
  position?: number;
}

export const Edge = (props: EdgeProps) => {
  const width = props.dx - props.x;
  const height = props.dy - props.y;

  const angle = (props.position ?? 0) * 0.35;
  const length = Math.sqrt(Math.pow(width, 2) + Math.pow(height, 2));

  const start = rotate([vertexRadius, 0], angle);
  const end = rotate([length - vertexRadius, 0], -angle, [length, 0]);

  const linePath = getLinePath(start, end, angle);
  // prettier-ignore
  const arrowPath = getArrowPath([length - vertexRadius, 0], [length, 0], -angle, true);

  const rad = Math.atan2(height, width);
  const deg = (rad * 180) / Math.PI;

  const transform = `translate(${props.x} ${props.y}) rotate(${deg})`;

  return (
    <path
      className={styles.edge}
      // prettier-ignore
      d={linePath + (props.directed ? arrowPath : "")}
      transform={transform}
    />
  );
};

const getArrowPath = (
  start: Position,
  origin: Position,
  angle: number,
  reversed: boolean = false
): string => {
  const deltaX = reversed ? -6 : 6;

  const [sx, sy] = start;
  const [ax, ay] = rotate([sx + deltaX, sy - 6], angle, origin);
  const [bx, by] = rotate([sx + deltaX, sy + 6], angle, origin);
  const [mx, my] = rotate([sx, sy], angle, origin);

  return `M${ax} ${ay}L${mx} ${my}L${bx} ${by}`;
};

const getLinePath = (a: Position, b: Position, angle: number): string => {
  const [ax, ay] = a;
  const [bx, by] = b;

  const hx = (ax + bx) / 2;
  const hy = Math.tan(angle) * hx;

  return `M${ax} ${ay}Q${hx} ${hy} ${bx} ${by}`;
};

const rotate = (
  point: Position,
  angle: number,
  origin: Position = [0, 0]
): Position => {
  const sin = Math.sin(angle);
  const cos = Math.cos(angle);

  let [px, py] = point;
  let [ox, oy] = origin;

  const x = (px - ox) * cos - (py - oy) * sin;
  const y = (px - ox) * sin + (py - oy) * cos;

  return [x + ox, y + oy];
};
