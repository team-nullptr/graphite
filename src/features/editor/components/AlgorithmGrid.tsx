import { Graph } from "../../../engine/runner/graph";
import { AlgorithmWithValidator } from "../models/Algorithm";
import { AlgorithmTile } from "./AlgorithmTile";

export interface AlgorithmGridProps {
  algorithms: AlgorithmWithValidator[];
  graph: Graph;
  onAlgorithmSelect?: (algorithm: AlgorithmWithValidator) => void;
}

export const AlgorithmGrid = (props: AlgorithmGridProps) => {
  return (
    <ul className="flex flex-col">
      {props.algorithms.map((algorithm) => {
        const isValid = algorithm.isValid?.(props.graph);
        const algorithmSelectHandler = () =>
          props.onAlgorithmSelect?.(algorithm);
        return (
          <AlgorithmTile
            key={algorithm.id}
            name={algorithm.name}
            onClick={algorithmSelectHandler}
            disabled={!isValid}
          />
        );
      })}
    </ul>
  );
};
