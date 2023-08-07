export type Position = [x: number, y: number];

export function getPointInSvgSpace(targetPositionOnScreen: Position, svg: SVGSVGElement): Position {
  const targetDOMPoint = new DOMPoint(...targetPositionOnScreen);
  const svgViewportOffsetMatrix = svg.getScreenCTM()?.inverse();

  const { x: targetInSVGSpaceX, y: targetInSVGSpaceY } =
    targetDOMPoint.matrixTransform(svgViewportOffsetMatrix);

  return [targetInSVGSpaceX, targetInSVGSpaceY];
}
