import { RefObject, useCallback, useEffect, useRef, useState } from "react";
import { Graph } from "../../../core/simulator/graph";
import { Arrangement } from "../types/arrangement";
import { SelectedVertex } from "../types/selectedVertex";
import { Vec2 } from "../types/vec2";
import { useForceSimulation } from "./useForceSimulation";
import { getPointInSvgSpace } from "~/shared/helpers/svg";

// TODO: Learn more about initial arrangement for force-directed graphs.
function preArrange(graph: Graph) {
  return Object.values(graph.vertices).reduce((arrangement, v) => {
    arrangement[v.id] = new Vec2(Math.random() * 200 - 100, Math.random() * 200 - 100);
    return arrangement;
  }, {} as Arrangement);
}

type Position = [x: number, y: number];

export function useGraphLayout(graph: Graph, svgRef: RefObject<SVGSVGElement>) {
  const areControlsEnabled = useRef<boolean>(true);
  const selectedVertexRef = useRef<SelectedVertex>();
  const [arrangement, setArrangment] = useState<Arrangement>(preArrange(graph));

  const vertexMouseDownHandler = useCallback(
    (id: string, event: MouseEvent) => {
      const svgElement = svgRef.current;
      if (!svgElement) {
        return;
      }

      const mousePositionOnScreen: Position = [event.clientX, event.clientY];
      const mouseInSvgSpace = getPointInSvgSpace(mousePositionOnScreen, svgElement);
      const vertexPosition = arrangement[id] ?? new Vec2(0, 0);

      const mouseOffset = new Vec2(...mouseInSvgSpace);
      mouseOffset.substract(vertexPosition);

      selectedVertexRef.current = { id, offset: mouseOffset };
      areControlsEnabled.current = false;
    },
    [svgRef, arrangement]
  );

  useEffect(() => {
    setArrangment((arrangement) => {
      const updatedArrangement = preArrange(graph);
      const currentVertices = new Set([...Object.keys(graph.vertices)]);

      for (const vertex of Object.keys(arrangement)) {
        if (currentVertices.has(vertex)) {
          updatedArrangement[vertex] = arrangement[vertex];
        }
      }

      return updatedArrangement;
    });
  }, [graph]);

  useEffect(() => {
    const mouseUpHandler = () => {
      selectedVertexRef.current = undefined;
      areControlsEnabled.current = true;
    };

    const mouseMoveHandler = (event: MouseEvent) => {
      const selectedVertex = selectedVertexRef.current;
      const svgElement = svgRef.current;
      if (!selectedVertex || !svgElement) {
        return;
      }

      event.preventDefault(); // Prevent selecting text

      const { id: vertexId, offset: mouseOffset } = selectedVertex;

      const mousePositionOnScreen: Position = [event.clientX, event.clientY];
      // prettier-ignore
      const mouseInSvgSpace = getPointInSvgSpace(mousePositionOnScreen, svgElement);

      const positionWithMouseOffset = new Vec2(...mouseInSvgSpace);
      positionWithMouseOffset.substract(mouseOffset);

      setArrangment((arrangement) => {
        return { ...arrangement, [vertexId]: positionWithMouseOffset };
      });
    };

    addEventListener("mousemove", mouseMoveHandler);
    addEventListener("mouseup", mouseUpHandler);

    return () => {
      removeEventListener("mousemove", mouseMoveHandler);
      removeEventListener("mouseup", mouseUpHandler);
    };
  }, [svgRef]);

  useForceSimulation(graph, selectedVertexRef, setArrangment);

  return {
    arrangement,
    vertexMouseDownHandler,
    svgRef,
    selectedVertexRef,
    areControlsEnabled,
  };
}
