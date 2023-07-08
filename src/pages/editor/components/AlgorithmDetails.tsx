import { Algorithm } from "../../../types/algorithm";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { Controls, ControlsButton } from "../../../shared/Controls";
import { PlayIcon } from "@heroicons/react/24/outline";
import { useEditorStore } from "../context/editor";
import { Select } from "../../../shared/ui/Select";
import { SpaceshipButton } from "../../../shared/ui/SpaceshipButton";

export interface AlgorithmDetails {
  algorithm: Algorithm;
  onBack: () => void;
}

export const AlgorithmDetails = ({ algorithm, onBack }: AlgorithmDetails) => {
  const graph = useEditorStore(({ graph }) => graph);

  return (
    <div className="flex h-full flex-col bg-slate-50">
      <Controls alignment="start">
        <ControlsButton
          icon={<ArrowLeftIcon className="h-5 w-5" />}
          onClick={onBack}
          alt="back"
        />
      </Controls>

      <div className="relative flex flex-1 flex-col divide-y divide-slate-300">
        <div className="flex flex-col gap-2 p-4">
          <span className="font-medium text-slate-800">{algorithm.name}</span>
          <p className="text-slate-600">{algorithm.description}</p>
        </div>

        {/* TODO: Is there any way to make this config universal so that it works with any algorithm? */}
        <div className="flex flex-col gap-8 p-4">
          <div className="flex flex-col gap-2">
            <span className="text-slate-800">
              Starting Vertex <span className="text-blue-500">*</span>
            </span>
            <Select
              label="Choose starting vertex"
              values={Object.keys(graph.vertices)}
            />
          </div>
        </div>
      </div>

      <div className="flex-g flex justify-end border-t border-gray-300 bg-slate-50 p-4">
        <SpaceshipButton
          onClick={() => console.log("Run the algorithm")}
          label="Run"
          icon={<PlayIcon className="h-5 w-5" />}
        />
      </div>
    </div>
  );
};
