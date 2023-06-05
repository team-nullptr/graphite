import { useMemo } from "react";
import { Position, rotatePosition } from "../model/position";

interface ArrowProps {
  position: Position;
  angle?: number;
  hue?: number;
}

export const Arrow = ({ position, angle = 0, hue }: ArrowProps) => {
  const path = useMemo(() => {
    return buildArrowPath(position, angle);
  }, [position, angle]);

  const fill =
    hue !== undefined ? `hsl(${hue}, 50%, 65%)` : "rgb(175, 175, 175)";

  return <path className="transition-[fill]" d={path} style={{ fill }} />;
};

const buildArrowPath = (position: Position, angle: number) => {
  // Rotate the arrow start and both arms
  const [sx, sy] = position;
  const [ax, ay] = rotatePosition([sx - 6, sy - 4], angle, position);
  const [bx, by] = rotatePosition([sx - 6, sy + 4], angle, position);

  // Construct the final path
  return `M${sx} ${sy}L${ax} ${ay}L${bx} ${by}`;
};
