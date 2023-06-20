import {
  Dispatch,
  MutableRefObject,
  SetStateAction,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
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

const useForceSimulation = (
  graph: Graph,
  selectedVertexRef: MutableRefObject<SelectedVertex | undefined>,
  setArrangement: Dispatch<SetStateAction<Arrangement>>
) => {
  const frameRef = useRef<number>();

  useEffect(() => {
    // TODO: Arrange only new vertices (do not move the old ones)
    setArrangement(preArrange(graph));
  }, [graph, setArrangement]);

  const runSimulation: FrameRequestCallback = useCallback(() => {
    const selectedVertex = selectedVertexRef.current;

    setArrangement((current) =>
      applyForces(graph, current, {
        ignore: new Set(selectedVertex ? [selectedVertex.id] : []),
      })
    );

    frameRef.current = requestAnimationFrame(runSimulation);
  }, [graph, setArrangement, selectedVertexRef]);

  useEffect(() => {
    frameRef.current = requestAnimationFrame(runSimulation);

    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, [runSimulation]);
};

export const useForceLayout = (graph: Graph) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const selectedVertexRef = useRef<SelectedVertex>();
  const [arrangement, setArrangment] = useState<Arrangement>(preArrange(graph));

  const vertexMouseDownHandler = (id: string, offset: Vec2) => {
    selectedVertexRef.current = { id, offset };
  };

  useForceSimulation(graph, selectedVertexRef, setArrangment);

  useEffect(() => {
    const mouseUpHandler = () => {
      selectedVertexRef.current = undefined;
    };

    const mouseMoveHandler = (event: MouseEvent) => {
      const boundingBox = svgRef.current?.getBoundingClientRect();

      if (!boundingBox || !selectedVertexRef.current) {
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
