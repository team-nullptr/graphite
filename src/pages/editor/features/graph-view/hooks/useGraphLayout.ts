import { RefObject, useEffect, useRef, useState } from "react";
import { Graph } from "../../../../../core/simulator/graph";

import { Arrangement } from "../types/arrangement";
import { SelectedVertex } from "../types/selectedVertex";
import { Vec2 } from "../types/vec2";
import { useForceSimulation } from "./useForceSimulation";

// TODO: Learn more about initial arrangement for force-directed graphs
const preArrange = (graph: Graph) =>
  Object.values(graph.vertices).reduce((arrangement, v) => {
    arrangement[v.id] = new Vec2(
      Math.random() * 200 + 100,
      Math.random() * 200 + 100
    );

    return arrangement;
  }, {} as Arrangement);

export const useGraphLayout = (
  graph: Graph,
  svgRef: RefObject<SVGSVGElement>
) => {
  const areControlsEnabled = useRef<boolean>(false);
  const selectedVertexRef = useRef<SelectedVertex>();
  const [arrangement, setArrangment] = useState<Arrangement>(preArrange(graph));

  const vertexMouseDownHandler = (id: string, event: MouseEvent) => {
    const svg = svgRef.current;
    if (!svg) return;

    const mouseInSvgSpace = getPointInSvgSpace(
      event.clientX,
      event.clientY,
      svg
    );
    const vertexPosition = arrangement[id];

    const offset = new Vec2(
      mouseInSvgSpace.x - vertexPosition.x,
      mouseInSvgSpace.y - vertexPosition.y
    );

    selectedVertexRef.current = { id, offset };
    areControlsEnabled.current = false;
  };

  useForceSimulation(graph, selectedVertexRef, setArrangment);

  useEffect(() => {
    // TODO: Arrange only new vertices (do not move the old ones)
    setArrangment(preArrange(graph));
  }, [graph]);

  useEffect(() => {
    const mouseUpHandler = () => {
      selectedVertexRef.current = undefined;
      areControlsEnabled.current = true;
    };

    const mouseMoveHandler = (event: MouseEvent) => {
      if (!selectedVertexRef.current) return;

      const svg = svgRef.current;
      if (!svg) return;

      const { id, offset } = selectedVertexRef.current;
      const position = getPointInSvgSpace(event.clientX, event.clientY, svg);

      // const scale = getSvgScale(svg);

      const positionWithMouseOffset = new Vec2(position.x, position.y);
      positionWithMouseOffset.substract(offset);

      setArrangment((arrangement) => ({
        ...arrangement,
        [id]: positionWithMouseOffset,
      }));
    };

    addEventListener("mousemove", mouseMoveHandler);
    addEventListener("mouseup", mouseUpHandler);

    return () => {
      removeEventListener("mousemove", mouseMoveHandler);
      removeEventListener("mouseup", mouseUpHandler);
    };
  }, []);

  return {
    arrangement,
    vertexMouseDownHandler,
    svgRef,
    selectedVertexRef,
    areControlsEnabled,
  };
};

const getPointInSvgSpace = (
  x: number,
  y: number,
  svg: SVGSVGElement
): DOMPoint => {
  const point = new DOMPoint(x, y);
  const svgViewportOffsetMatrix = svg.getScreenCTM()?.inverse();
  return point.matrixTransform(svgViewportOffsetMatrix);
};
