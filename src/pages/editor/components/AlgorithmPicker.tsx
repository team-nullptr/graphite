import { useEditorStore } from "../context/editor";
import { AlgorithmDetails } from "./AlgorithmDetails";
import { AlgorithmGrid } from "./AlgorithmGrid";
import { algorithms } from "../../../algorithms";
import { useState } from "react";
import { Algorithm } from "../../../types/algorithm";

export const AlgorithmPicker = () => {
  const [pickedAlgorithm, setPickerAlgorithm] = useState<Algorithm>();

  const { setAlgorithm } = useEditorStore(({ algorithm, setAlgorithm }) => ({
    algorithm,
    setAlgorithm,
  }));

  return (
    <div className="h-full w-full bg-slate-50">
      {pickedAlgorithm ? (
        <AlgorithmDetails
          algorithm={pickedAlgorithm}
          onBack={() => {
            setAlgorithm(null);
            setPickerAlgorithm(undefined);
          }}
        />
      ) : (
        <AlgorithmGrid
          algorithms={algorithms}
          onAlgorithmSelect={setPickerAlgorithm}
        />
      )}
    </div>
  );
};
