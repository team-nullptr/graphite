import { RefObject, useEffect, useState } from "react";
import { useResizeObserver } from "./useResizeObserver";
import { useZoom } from "./useZoom";
import { usePan } from "./usePan";

type Viewport = [x: number, y: number, width: number, height: number];

export const useSvgControls = (
  containerRef: RefObject<HTMLDivElement>,
  svgRef: RefObject<SVGSVGElement>,
  isPanningEnabled: RefObject<boolean>
): Viewport => {
  const [viewport, setViewport] = useState<Viewport>([0, 0, 0, 0]);
  const [containerRect, previousContainerRect] =
    useResizeObserver(containerRef);

  useEffect(() => {
    if (!containerRect) return;

    const { width: currentWidth, height: currentHeight } = containerRect;
    const { width: previousWidth, height: previousHeight } =
      previousContainerRect.current ?? containerRect;

    setViewport((viewport) => {
      const [x, y, viewportWidth, viewportHeight] = viewport;

      if (viewportWidth == 0 || viewportHeight == 0) {
        return [0, 0, currentWidth, currentHeight];
      }

      const horizontalResizeRatio = currentWidth / previousWidth;
      const verticalResizeRatio = currentHeight / previousHeight;

      return [
        x,
        y,
        viewportWidth * horizontalResizeRatio,
        viewportHeight * verticalResizeRatio,
      ];
    });
  }, [containerRect]);

  const containerDimen: [number, number] = [
    containerRect?.width ?? 0,
    containerRect?.height ?? 0,
  ];

  usePan(svgRef, containerDimen, setViewport, isPanningEnabled);
  useZoom(svgRef, setViewport);

  return viewport;
};
