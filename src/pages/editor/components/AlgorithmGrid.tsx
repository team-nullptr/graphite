import { Algorithm } from "../../../types/algorithm";
import { AlgorithmCard } from "./AlgorithmCard";

export interface AlgorithmGridProps {
  algorithms: Algorithm[];
  onAlgorithmSelect?: (algorithm: Algorithm) => void;
}

export const AlgorithmGrid = ({
  algorithms,
  onAlgorithmSelect,
}: AlgorithmGridProps) => {
  return (
    <div className="flex h-full w-full flex-col divide-y divide-base-300 bg-base-200 dark:bg-base-300-dark">
      {algorithms.map((algorithm) => (
        <AlgorithmCard
          key={algorithm.name}
          algorithm={algorithm}
          onClick={() => onAlgorithmSelect?.(algorithm)}
        />
      ))}
    </div>
  );
};
