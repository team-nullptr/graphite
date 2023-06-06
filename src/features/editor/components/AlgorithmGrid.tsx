import { Algorithm } from "../../../models/algorithm";

export interface AlgorithmGridProps {
  algorithms: Algorithm[];
  onAlgorithmSelect?: (algorithm: Algorithm) => void;
}

export const AlgorithmGrid = ({
  algorithms,
  onAlgorithmSelect,
}: AlgorithmGridProps) => {
  return (
    <div className="flex h-full w-full flex-col bg-base-200 dark:bg-base-300-dark">
      {algorithms.map((algorithm) => (
        <div
          key={algorithm.name}
          className="w-full p-4 text-text-base dark:text-text-base-dark"
          onClick={() => onAlgorithmSelect?.(algorithm)}
        >
          {algorithm.name}
        </div>
      ))}
    </div>
  );
};
