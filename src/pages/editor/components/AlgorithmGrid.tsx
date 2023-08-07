import { AlgorithmCard } from "./AlgorithmCard";
import { Algorithm } from "~/core/simulator/algorithm";

export type AlgorithmGridProps = {
  algorithms: Algorithm[];
  onAlgorithmSelect?: (algorithm: Algorithm) => void;
};

export function AlgorithmGrid({ algorithms, onAlgorithmSelect }: AlgorithmGridProps) {
  return (
    <div className="flex h-full w-full flex-col bg-slate-50">
      {algorithms.map((algorithm) => (
        <AlgorithmCard
          key={algorithm.name}
          algorithm={algorithm}
          onClick={() => onAlgorithmSelect?.(algorithm)}
        />
      ))}
    </div>
  );
}
