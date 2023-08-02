export type Position = [x: number, y: number];

export const useZoom = (): { center: Position; zoom: number } => {
  return { center: [0, 0], zoom: 4 };
};
