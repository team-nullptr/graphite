export type Position = [x: number, y: number];

export const scaleCenterToMatchTarget = (
  center: Position,
  target: Position,
  scale: number
): Position => {
  const newCenterX = scaleAxisCenterToMatchTarget(center[0], target[0], scale);
  const newCenterY = scaleAxisCenterToMatchTarget(center[1], target[1], scale);
  return [newCenterX, newCenterY];
};

const scaleAxisCenterToMatchTarget = (center: number, target: number, scale: number): number => {
  const delta = target - center;
  return target - delta / scale;
};
