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
    <div className="h-full w-full bg-slate-50">
      {algorithm ? (
        <AlgorithmDetails
          algorithm={algorithm}
          onBack={() => replaceAlgorithm(null)}
        />
      ) : (
        <AlgorithmGrid
          algorithms={algorithms}
          onAlgorithmSelect={replaceAlgorithm}
        />
      )}
    </div>
  );
};
