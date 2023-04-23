export type Position = [x: number, y: number];

export const rotatePosition = (
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
