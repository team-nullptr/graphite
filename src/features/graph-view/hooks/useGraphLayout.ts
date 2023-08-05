import { RefObject, useEffect, useRef, useState } from "react";
import { Graph } from "../../../core/simulator/graph";
import { Arrangement } from "../types/arrangement";
import { SelectedVertex } from "../types/selectedVertex";
import { Vec2 } from "../types/vec2";
import { useForceSimulation } from "./useForceSimulation";

// TODO: Learn more about initial arrangement for force-directed graphs.
const preArrange = (graph: Graph) =>
  Object.values(graph.vertices).reduce((arrangement, v) => {
    arrangement[v.id] = new Vec2(
      Math.random() * 200 - 100,
      Math.random() * 200 - 100
    );

    return arrangement;
  }, {} as Arrangement);

const getPointInSvgSpace = (
  x: number,
  y: number,
  svg: SVGSVGElement
): DOMPoint => {
  const point = new DOMPoint(x, y);
  const svgViewportOffsetMatrix = svg.getScreenCTM()?.inverse();
  return point.matrixTransform(svgViewportOffsetMatrix);
};

export const useGraphLayout = (
  graph: Graph,
  svgRef: RefObject<SVGSVGElement>
) => {
  const areControlsEnabled = useRef<boolean>(true);
  const selectedVertexRef = useRef<SelectedVertex>();
  const [arrangement, setArrangment] = useState<Arrangement>(preArrange(graph));

  const vertexMouseDownHandler = (id: string, event: MouseEvent) => {
    const svg = svgRef.current;

    if (!svg) {
      return;
    }

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

  useEffect(() => {
    const updatedArrangement = preArrange(graph);
    const currentVertices = new Set([...Object.keys(graph.vertices)]);

    for (const vertex of Object.keys(arrangement)) {
      if (currentVertices.has(vertex)) {
        updatedArrangement[vertex] = arrangement[vertex];
      }
    }

    setArrangment(updatedArrangement);
  }, [graph]);

  useEffect(() => {
    const mouseUpHandler = () => {
      selectedVertexRef.current = undefined;
      console.log("enabling back again");
      areControlsEnabled.current = true;
    };

    const mouseMoveHandler = (event: MouseEvent) => {
      if (!selectedVertexRef.current || !svgRef.current) {
        return;
      }

      const svg = svgRef.current;
      const { id, offset } = selectedVertexRef.current;

      const position = getPointInSvgSpace(event.clientX, event.clientY, svg);

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

  useForceSimulation(graph, selectedVertexRef, setArrangment);

  return {
    arrangement,
    vertexMouseDownHandler,
    svgRef,
    selectedVertexRef,
    areControlsEnabled,
  };
};
