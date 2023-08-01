import { useMemo } from "react";
import { Vec2 } from "../types/vec2";
import type { Color } from "~/types/color";
import colors from "tailwindcss/colors";

interface ArrowProps {
  position: Vec2;
  angle?: number;
  color?: Color;
}

export const Arrow = ({ position, angle = 0, color = "slate" }: ArrowProps) => {
  const path = useMemo(() => {
    return buildArrowPath(position, angle);
  }, [position, angle]);

  const fill = colors[color][700];

  return <path className="transition-[fill]" d={path} style={{ fill }} />;
};

const buildArrowPath = (position: Vec2, angle: number) => {
  // Rotate the arrow start and both arms
  const { x: sx, y: sy } = position;

  const { x: ax, y: ay } = new Vec2(sx - 6, sy - 4).rotate(angle, position);
  const { x: bx, y: by } = new Vec2(sx - 6, sy + 4).rotate(angle, position);

  // Construct the final path
  return `M${sx} ${sy}L${ax} ${ay}L${bx} ${by}`;
};
