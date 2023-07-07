import { Algorithm } from "../../../types/algorithm";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { Controls, ControlsButton } from "../../../shared/Controls";
import { useState } from "react";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/outline";

import { PlayIcon } from "@heroicons/react/20/solid";

import { useEditorStore } from "../context/editor";

export interface AlgorithmDetails {
  algorithm: Algorithm;
  onBack: () => void;
}

export const AlgorithmDetails = ({ algorithm, onBack }: AlgorithmDetails) => {
  const graph = useEditorStore(({ graph }) => graph);

  return (
    <div className="flex h-full flex-col bg-slate-50">
      <Controls alignment="between">
        <ControlsButton
          icon={<ArrowLeftIcon className="h-5 w-5" />}
          onClick={onBack}
          alt="back"
        />

        <button className="flex items-center gap-2 rounded-md bg-blue-500 px-2 py-1 text-sm text-white">
          Run <PlayIcon className="h-4 w-4" />
        </button>
      </Controls>
      <div className="flex flex-col divide-y divide-slate-300">
        <div className="flex flex-col gap-2 p-4">
          <span className="font-medium text-slate-800">{algorithm.name}</span>
          <p className="text-slate-600">{algorithm.description}</p>
        </div>
        <div className="flex flex-col gap-8 p-4">
          <div className="flex flex-col gap-2">
            <span className="text-slate-800">
              Starting Vertex <span className="text-blue-500">*</span>
            </span>
            <Select values={Object.keys(graph.vertices)} />
          </div>
        </div>
      </div>
    </div>
  );
};

type SelectOptions = {
  values: string[];
};

const Select = ({ values }: SelectOptions) => {
  const [value, setValue] = useState<string | undefined>(values[0]);
  const [opened, setOpened] = useState(false);

  const handleValueChange = (value: string) => {
    setValue(value);
    setOpened(false);
  };

  return (
    <div className="relative w-full">
      <div
        className="relative w-full rounded-md border px-4 py-2"
        onClick={() => setOpened(!opened)}
      >
        {value}
        {opened ? (
          <ChevronUpIcon className="absolute bottom-0 right-2 top-0 my-auto h-4 w-4" />
        ) : (
          <ChevronDownIcon className="absolute bottom-0 right-2 top-0 my-auto h-4 w-4" />
        )}
      </div>
      {opened && (
        <div className="absolute top-12 max-h-48 w-full overflow-y-scroll rounded-md border">
          {values.map((value) => (
            <div
              className="flex h-10 items-center px-4 py-2 hover:bg-gray-100"
              key={value}
              onClick={() => handleValueChange(value)}
            >
              {value}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
