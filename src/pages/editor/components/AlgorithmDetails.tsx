import { ArrowLeftIcon, PlayIcon } from "@heroicons/react/24/outline";
import { Fragment, useMemo, useState } from "react";
import {
  Algorithm,
  AlgorithmParam,
  AlgorithmParamType,
  validateAlgorithmParams,
} from "~/core/simulator/algorithm";
import { Controls, ControlsButton } from "~/shared/Controls";
import { Select } from "~/shared/ui/Select";
import { SpaceshipButton } from "~/shared/ui/SpaceshipButton";
import { useEditorStore } from "../context/editor";

export interface AlgorithmDetails {
  algorithm: Algorithm<{}>;
  onBack: () => void;
}

export function AlgorithmDetails({ algorithm, onBack }: AlgorithmDetails) {
  const { graph, setMode } = useEditorStore(({ graph, setMode }) => ({
    graph,
    setMode,
  }));

  const handleBackClicked = () => {
    setMode({ type: "IDLE" });
    onBack();
  };

  // TODO: Store params value in the editor store to provide (a better/any) user experience
  const [paramsValue, setParamsValue] = useState<Record<string, string>>({});

  const handleSetParamsValue = (paramName: string, newParamValue: string) => {
    setParamsValue((paramsValue) => {
      return { ...paramsValue, [paramName]: newParamValue };
    });
  };

  const availableVertices = Object.keys(graph.vertices);

  const isParamValueValid = useMemo(() => {
    return validateAlgorithmParams(algorithm.params, paramsValue);
  }, [paramsValue]);

  const loadSteps = () => {
    const steps = algorithm.stepGenerator(graph, paramsValue);
    setMode({ type: "SIMULATION", steps });
  };

  return (
    <div className="flex h-full flex-col bg-slate-50">
      <Controls alignment="start" className="border-b border-slate-300">
        <ControlsButton
          icon={<ArrowLeftIcon className="h-5 w-5" />}
          onClick={handleBackClicked}
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
            <AlgorithmDetailParams
              params={algorithm.params}
              value={paramsValue}
              availableVertices={availableVertices}
              onChange={handleSetParamsValue}
            />
          </div>
        </div>
      </div>
      <div className="flex-g flex justify-end bg-slate-50 p-4">
        <SpaceshipButton
          icon={<PlayIcon className="h-5 w-5" />}
          label="Run"
          disabled={!isParamValueValid}
          disabledHint="Fill all required fields"
          onClick={loadSteps}
        />
      </div>
    </div>
  );
}

interface AlgorithmDetailParamsProps {
  params: Record<string, AlgorithmParam>;
  value: Record<string, string>;
  onChange?: (paramName: string, value: string) => void;
  availableVertices?: string[];
}

function AlgorithmDetailParams(props: AlgorithmDetailParamsProps) {
  const renderSelect = (paramName: string, paramType: AlgorithmParamType) => {
    let dropdownValues: string[] = [];
    if (paramType === "vertex") {
      dropdownValues = props.availableVertices ?? [];
    }
    return (
      <Select
        label={paramName}
        value={props.value[paramName]}
        onChange={(newValue) => props.onChange?.(paramName, newValue)}
        values={dropdownValues}
      />
    );
  };

  const renderedParams = Object.entries(props.params).map((paramEntry) => {
    const [paramName, paramDetails] = paramEntry;
    return (
      <Fragment key={paramName}>
        <span className="text-slate-800">
          {paramName}
          {paramDetails.required && <span className="text-blue-500">*</span>}
        </span>
        {renderSelect(paramName, paramDetails.type)}
      </Fragment>
    );
  });

  return <>{renderedParams}</>;
}
