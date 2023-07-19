import { Algorithm } from "~/types/algorithm";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { Controls, ControlsButton } from "~/shared/Controls";
import { PlayIcon } from "@heroicons/react/24/outline";
import { useEditorStore } from "../context/editor";
import { Select } from "~/shared/ui/Select";
import { SpaceshipButton } from "~/shared/ui/SpaceshipButton";
import { useEffect, useState } from "react";

export interface AlgorithmDetails {
  algorithm: Algorithm<unknown>;
  onBack: () => void;
}

export const AlgorithmDetails = ({ algorithm, onBack }: AlgorithmDetails) => {
  const [startingVertex, setStartingVertex] = useState<string>();

  const { graph, setMode } = useEditorStore(({ graph, setMode }) => ({
    graph,
    setMode,
  }));

  useEffect(() => {
    if (startingVertex && graph.vertices[startingVertex] === undefined) {
      setStartingVertex(undefined);
    }
  }, [graph, startingVertex]);

  const loadInstructions = () => {
    if (!startingVertex) {
      return;
    }

    setMode({
      type: "SIMULATION",
      steps: algorithm.algorithm(graph, startingVertex),
    });
  };

  const handleOnBack = () => {
    setMode({ type: "IDLE" });
    onBack();
  };

  const vertices = Object.keys(graph.vertices);

  return (
    <div className="flex h-full flex-col divide-y divide-slate-300 bg-slate-50">
      <Controls alignment="start">
        <ControlsButton
          icon={<ArrowLeftIcon className="h-5 w-5" />}
          onClick={handleOnBack}
          alt="back"
        />
      </Controls>

      <div className="relative flex flex-1 flex-col divide-y divide-slate-300">
        <div className="flex flex-col gap-2 p-4">
          <span className="font-medium text-slate-800">{algorithm.name}</span>
          <p className="text-slate-600">{algorithm.description}</p>
        </div>

        <div className="flex flex-col gap-8 p-4">
          <div className="flex flex-col gap-2">
            <span className="text-slate-800">
              Starting Vertex <span className="text-blue-500">*</span>
            </span>
            <Select
              label="Choose starting vertex"
              value={startingVertex}
              onChange={setStartingVertex}
              values={vertices}
            />
          </div>
        </div>
      </div>

      <div className="flex-g flex justify-end bg-slate-50 p-4">
        <SpaceshipButton
          disabled={startingVertex === undefined}
          disabledHint="Select the starting vertex!"
          onClick={loadInstructions}
          label="Run"
          icon={<PlayIcon className="h-5 w-5" />}
        />
      </div>
    </div>
  );
};
