import { useCallback, useEffect, useRef, useState } from "react";
import { Graph } from "../../../engine/runner/graph";
import { Vec2 } from "../model/vec2";
import { Arrangement } from "../model/arrangement";
import { applyForces } from "../core/forceLayout";

const preArrange = (graph: Graph) =>
  Object.values(graph.vertices).reduce((arrangement, v, i) => {
    arrangement[v.id] = new Vec2([100 + 100 * i, 100 + 100 * i]);
    return arrangement;
  }, {} as Arrangement);

type SelectedVertex = {
  id: string;
  offset: Vec2;
};

export const useForceLayout = (graph: Graph) => {
  // TODO: There is a bug when you paste graph code into editor This hook craches :()

  const svgRef = useRef<SVGSVGElement>(null);
  const selectedVertexRef = useRef<SelectedVertex>();
  const requestRef = useRef<number>();
  const [arrangement, setArrangment] = useState<Arrangement>(preArrange(graph));

  // Vertex dragging
  const vertexMouseDownHandler = (id: string, offset: Vec2) => {
    selectedVertexRef.current = { id, offset };
  };

  useEffect(() => {
    const mouseMoveHandler = (event: MouseEvent) => {
      const boundingBox = svgRef.current?.getBoundingClientRect();

      if (!boundingBox) {
        return;
      }

      if (!selectedVertexRef.current) {
        return;
      }

      const {
        id,
        offset: { x: ox, y: oy },
      } = selectedVertexRef.current;
      const x = event.clientX - boundingBox.left - ox;
      const y = event.clientY - boundingBox.top - oy;

      setArrangment((arrangement) => {
        return {
          ...arrangement,
          [id]: new Vec2([x, y]),
        };
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

  // Simulation
  useEffect(() => {
    // TODO: We don't want to rearrange vertices that were already arranged.
    // We need to arrange only newly added vertices.
    setArrangment(preArrange(graph));
  }, [graph]);

  const runSimulation: FrameRequestCallback = useCallback(() => {
    setArrangment((current) =>
      applyForces(graph, current, {
        ignore: selectedVertexRef.current
          ? new Set([selectedVertexRef.current.id])
          : new Set(),
      })
    );
    requestRef.current = requestAnimationFrame(runSimulation);
  }, [graph]);

  useEffect(() => {
    requestRef.current = requestAnimationFrame(runSimulation);

    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [runSimulation]);

  return {
    arrangement,
    vertexMouseDownHandler,
    svgRef,
    selectedVertexRef,
  };
};
