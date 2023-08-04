export type Position = [x: number, y: number];

export const getPointInSvgSpace = (
  targetPositionOnScreen: Position,
  svg: SVGSVGElement
): Position => {
  const targetDOMPoint = new DOMPoint(...targetPositionOnScreen);
  const svgViewportOffsetMatrix = svg.getScreenCTM()?.inverse();
  const targetInSVGSpace = targetDOMPoint.matrixTransform(
    svgViewportOffsetMatrix
  );
  const { x: targetInSVGSpaceX, y: targetInSVGSpaceY } = targetInSVGSpace;
  return [targetInSVGSpaceX, targetInSVGSpaceY];
};
