import {
  MutableRefObject,
  Dispatch,
  SetStateAction,
  useRef,
  useEffect,
  useCallback,
} from "react";
import { Graph } from "../../../core/simulator/graph";
import { applyForces } from "../core/forceLayout";
import { Arrangement } from "../types/arrangement";
import { SelectedVertex } from "../types/selectedVertex";

export const useForceSimulation = (
  graph: Graph,
  selectedVertexRef: MutableRefObject<SelectedVertex | undefined>,
  setArrangement: Dispatch<SetStateAction<Arrangement>>
) => {
  const frameRef = useRef<number>();

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
