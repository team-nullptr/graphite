import { useEditorStore } from "../context/editor";
import { Algorithm } from "../../../types/algorithm";
import { AlgorithmDetails } from "./AlgorithmDetails";
import { AlgorithmGrid } from "./AlgorithmGrid";
import { dijkstraAlgorithm } from "../../../algorithms/dijkstra";

const algorithms: Algorithm[] = [dijkstraAlgorithm];

export const AlgorithmPicker = () => {
  const { algorithm, replaceAlgorithm } = useEditorStore(
    ({ algorithm, replaceAlgorithm }) => ({
      algorithm,
      replaceAlgorithm,
    })
  );

  return (
    <div className="h-full w-full bg-base-200 dark:bg-base-300-dark">
      {algorithm ? (
        <AlgorithmDetails algorithm={algorithm} />
      ) : (
        <AlgorithmGrid
          algorithms={algorithms}
          onAlgorithmSelect={replaceAlgorithm}
        />
      )}
    </div>
  );
};
