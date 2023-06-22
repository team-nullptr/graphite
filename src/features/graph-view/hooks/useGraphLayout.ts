import { useEffect, useRef, useState } from "react";
import { Graph } from "../../../engine/runner/graph";
import { Vec2 } from "../types/vec2";
import { Arrangement } from "../types/arrangement";
import { SelectedVertex } from "../types/selectedVertex";
import { useForceSimulation } from "./useForceSimulation";

// TODO: Learn more about initial arrangement for force-directed graphs
// http://www.cmap.polytechnique.fr/~nikolaus.hansen/proceedings/2015/GECCO/companion/p1397.pdf!
const preArrange = (graph: Graph) =>
  Object.values(graph.vertices).reduce((arrangement, v, i) => {
    arrangement[v.id] = new Vec2([100 + 100 * i, 100 + 100 * i]);
    return arrangement;
  }, {} as Arrangement);

export const useGraphLayout = (graph: Graph) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const selectedVertexRef = useRef<SelectedVertex>();
  const [arrangement, setArrangment] = useState<Arrangement>(preArrange(graph));

  const vertexMouseDownHandler = (id: string, offset: Vec2) => {
    selectedVertexRef.current = { id, offset };
  };

  useForceSimulation(graph, selectedVertexRef, setArrangment);

  useEffect(() => {
    // TODO: Arrange only new vertices (do not move the old ones)
    setArrangment(preArrange(graph));
  }, [graph]);

  useEffect(() => {
    const mouseUpHandler = () => {
      selectedVertexRef.current = undefined;
    };

    const mouseMoveHandler = (event: MouseEvent) => {
      if (!svgRef.current || !selectedVertexRef.current) {
        return;
      }

      const { id, offset } = selectedVertexRef.current;
      const boundingBox = svgRef.current.getBoundingClientRect();

      const finalPosition = new Vec2([
        event.clientX - boundingBox.left - offset.x,
        event.clientY - boundingBox.top - offset.y,
      ]);

      setArrangment((arrangement) => ({
        ...arrangement,
        [id]: finalPosition,
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
  };
};
