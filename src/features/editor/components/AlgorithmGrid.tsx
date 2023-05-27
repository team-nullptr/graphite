import { Algorithm } from "../../../models/algorithm";
import { AlgorithmTile } from "./AlgorithmTile";

export interface AlgorithmGridProps {
  algorithms: Algorithm[];
  onAlgorithmSelect?: (algorithm: Algorithm) => void;
}

export const AlgorithmGrid = (props: AlgorithmGridProps) => {
  return (
    <ul className="flex flex-col">
      {props.algorithms.map((algorithm) => (
        <AlgorithmTile
          key={algorithm.id}
          name={algorithm.name}
          onClick={() => props.onAlgorithmSelect?.(algorithm)}
        />
      ))}
    </ul>
  );
};
