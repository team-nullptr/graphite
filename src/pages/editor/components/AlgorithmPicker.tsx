import { algorithms } from "~/core/simulator/algorithms";
import { useEditorStore } from "../context/editor";
import { AlgorithmDetails } from "./AlgorithmDetails";
import { AlgorithmGrid } from "./AlgorithmGrid";

export function AlgorithmPicker() {
  const [algorithm, setAlgorithm] = useEditorStore((store) => [
    store.algorithm,
    store.setAlgorithm,
  ]);

  return (
    <div className="h-full w-full bg-slate-50">
      {algorithm ? (
        <AlgorithmDetails algorithm={algorithm} onBack={() => setAlgorithm(undefined)} />
      ) : (
        <AlgorithmGrid algorithms={algorithms} onAlgorithmSelect={setAlgorithm} />
      )}
    </div>
  );
}
