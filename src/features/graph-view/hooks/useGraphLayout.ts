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
    arrangement[v.id] = new Vec2(Math.random() * 400 - 200, Math.random() * 400 - 200);
    return arrangement;
  }, {} as Arrangement);
}

type Position = [x: number, y: number];

export function useGraphLayout(graph: Graph, svgRef: RefObject<SVGSVGElement>) {
  const areControlsEnabled = useRef<boolean>(true);
  const selectedVertexRef = useRef<SelectedVertex>();
  const [chilled, setChilled] = useState(false);
  const [arrangement, setArrangement] = useState<Arrangement>(preArrange(graph));

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
      mouseOffset.subtract(vertexPosition);

      selectedVertexRef.current = { id, offset: mouseOffset };
      areControlsEnabled.current = false;
    },
    [svgRef, arrangement]
  );

  useEffect(() => {
    setArrangement((arrangement) => {
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
      const mouseInSvgSpace = getPointInSvgSpace(mousePositionOnScreen, svgElement);

      const positionWithMouseOffset = new Vec2(...mouseInSvgSpace);
      positionWithMouseOffset.subtract(mouseOffset);

      setArrangement((arrangement) => {
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

  useEffect(() => {
    const handleShiftDown = (e: KeyboardEvent) => {
      if (e.key === "Shift") {
        setChilled(true);
      }
    };

    const handleShiftUp = (e: KeyboardEvent) => {
      if (e.key === "Shift") {
        setChilled(false);
      }
    };

    addEventListener("keydown", handleShiftDown);
    addEventListener("keyup", handleShiftUp);

    return () => {
      removeEventListener("keydown", handleShiftDown);
      removeEventListener("keyup", handleShiftUp);
    };
  }, []);

  useForceSimulation(graph, selectedVertexRef, chilled, setArrangement);

  return {
    arrangement,
    vertexMouseDownHandler,
    svgRef,
    selectedVertexRef,
    areControlsEnabled,
  };
}
