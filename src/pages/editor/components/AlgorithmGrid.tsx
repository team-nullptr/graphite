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
    <div className="flex h-full w-full flex-col divide-y divide-slate-300 bg-slate-50">
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
