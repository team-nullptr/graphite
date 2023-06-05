import { Position, rotatePosition } from "../model/position";
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

  const start: Position = [vertexRadius, 0];
  const end: Position = [length - vertexRadius, 0];

  const rad = Math.atan2(height, width);
  const deg = (rad * 180) / Math.PI;

  const transform = `translate(${props.x} ${props.y}) rotate(${deg})`;
  const path = getLinePath(start, end);

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
      {props.directed && <Arrow position={end} hue={props.hue} />}
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

const getLinePath = (start: Position, end: Position): string => {
  const [sx, sy] = start;
  const [ex, ey] = end;
  return `M${sx} ${sy} ${ex} ${ey}`;
};
