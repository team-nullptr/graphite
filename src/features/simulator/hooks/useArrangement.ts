import { useState, useRef, useEffect } from "react";
import { Vertex } from "../../../engine/runner/graph";
import { Position } from "../model/position";
import { Arrangement } from "../Simulator";

type SelectedVertex = {
  id: string;
  offset: Position;
};

export const useArrangement = () => {
  const [arrangement, setArrangement] = useState<Arrangement>({});
  const svgRef = useRef<SVGSVGElement>(null);
  const selectedVertexRef = useRef<SelectedVertex>();

  const vertexMouseDownHandler = (vertex: Vertex, offset: Position) => {
    selectedVertexRef.current = { id: vertex.id, offset };
  };

  useEffect(() => {
    const mouseMoveHandler = (event: MouseEvent) => {
      const boundingBox = svgRef.current?.getBoundingClientRect();
      if (!boundingBox) return;

      const vertex = selectedVertexRef.current;
      if (!vertex) return;

      const [ox, oy] = vertex.offset;
      const x = event.clientX - boundingBox.left - ox;
      const y = event.clientY - boundingBox.top - oy;

      setArrangement((arrangement) => {
        return { ...arrangement, [vertex.id]: [x, y] };
      });
    };

    const mouseUpHandler = () => {
      selectedVertexRef.current = undefined;
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
  };
};
