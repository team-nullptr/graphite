import { nanoid } from "nanoid";
import { useEditorStore } from "../context/editor";
import { Algorithm } from "../models/Algorithm";
import { AlgorithmDetails } from "./AlgorithmDetails";
import { AlgorithmGrid } from "./AlgorithmGrid";

const algorithms: Algorithm[] = [
  {
    id: nanoid(),
    name: "yes",
    impl: () => ["step"],
  },
];

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
