import { ArrowLeftIcon, PlayIcon, StopIcon } from "@heroicons/react/24/outline";
import { Fragment, useMemo } from "react";
import {
  Algorithm,
  AlgorithmParamDefinition,
  AlgorithmParamDefinitions,
  AlgorithmParamType,
  validateAlgorithmParams,
} from "~/core/simulator/algorithm";
import { Vertex } from "~/core/simulator/graph";
import { Controls, ControlsButton } from "~/shared/Controls";
import { Select } from "~/shared/ui/Select";
import { SpaceshipButton } from "~/shared/ui/SpaceshipButton";
import { useEditorStore } from "../context/editor";
import ReactMarkdown from "react-markdown";

export interface AlgorithmDetails {
  algorithm: Algorithm<NonNullable<unknown>>;
  onBack: () => void;
}

export function AlgorithmDetails({ algorithm, onBack }: AlgorithmDetails) {
  const graph = useEditorStore((s) => s.graph);
  const mode = useEditorStore((s) => s.mode);
  const setMode = useEditorStore((s) => s.setMode);
  const algorithmParams = useEditorStore((s) => s.algorithmParams);
  const setAlgorithmParams = useEditorStore((s) => s.setAlgorithmParams);

  const handleBackClicked = () => {
    setMode({ type: "IDLE" });
    setAlgorithmParams({});
    onBack();
  };

  const handleSetParamsValue = (
    paramName: keyof (typeof algorithm)["params"],
    newParamValue: string
  ) => {
    setAlgorithmParams({ ...algorithmParams, [paramName]: newParamValue });
  };

  const isParamValueValid = useMemo(() => {
    return validateAlgorithmParams(algorithm.params, algorithmParams as Record<string, string>);
  }, [algorithmParams, algorithm.params]);

  const loadSteps = () => {
    if (!isParamValueValid) return;
    const steps = algorithm.stepGenerator(graph, algorithmParams);
    setMode({ type: "SIMULATION", steps });
  };

  const stopSimulation = () => {
    setMode({ type: "IDLE" });
  };

  return (
    <div className="flex h-full flex-col bg-slate-50">
      <Controls
        alignment="start"
        className="sticky top-0 z-10 border-b border-slate-300 bg-slate-50"
      >
        <ControlsButton
          icon={<ArrowLeftIcon className="h-5 w-5" />}
          onClick={handleBackClicked}
          label="back"
        />
      </Controls>
      <div className="relative flex flex-1 flex-col divide-y divide-slate-300">
        <div className="flex flex-col gap-2 p-4">
          <span className="font-medium text-slate-800">{algorithm.name}</span>
          <p className="text-slate-600">{algorithm.description}</p>
        </div>
        <div className="flex flex-col gap-8 p-4">
          <div className="flex flex-col gap-2">
            <AlgorithmDetailParams<NonNullable<unknown>>
              paramDefinitions={algorithm.params}
              value={algorithmParams}
              availableVertices={Object.values(graph.vertices)}
              onChange={handleSetParamsValue}
            />
          </div>
          <div className="flex justify-end bg-slate-50">
            {mode.type === "IDLE" ? (
              <SpaceshipButton
                icon={<PlayIcon className="h-5 w-5" />}
                label="Run"
                disabled={!isParamValueValid}
                disabledHint="Fill all required fields"
                onClick={loadSteps}
              />
            ) : (
              <SpaceshipButton
                icon={<StopIcon className="h-5 w-5" />}
                label="Stop"
                onClick={stopSimulation}
              />
            )}
          </div>
        </div>
        <div className="overflow-y-auto">
          <div className="prose prose-slate m-auto max-w-4xl p-4">
            <ReactMarkdown>{algorithm.guide}</ReactMarkdown>
          </div>
        </div>
      </div>
    </div>
  );
}

interface AlgorithmDetailParamsProps<T extends object> {
  paramDefinitions: AlgorithmParamDefinitions<T>;
  value: Record<keyof T, string>;
  onChange?: (paramName: keyof T, value: string) => void;
  availableVertices?: Vertex[];
}

function AlgorithmDetailParams<T extends object>(props: AlgorithmDetailParamsProps<T>) {
  const handleSelectChange = (paramName: keyof T, newValue: string) => {
    props.onChange?.(paramName, newValue);
  };
  const renderSelect = (paramName: keyof T, paramType: AlgorithmParamType<any>) => {
    let dropdownValues: string[] = [];
    if (paramType === "vertex") {
      dropdownValues = (props.availableVertices ?? []).map((vertex) => vertex.id);
    }
    return (
      <Select
        label={String(paramName)}
        value={props.value[paramName]}
        onChange={(newValue) => handleSelectChange(paramName, newValue)}
        values={dropdownValues}
      />
    );
  };

  const renderedParams = Object.entries(props.paramDefinitions).map((paramEntry) => {
    const paramName = paramEntry[0] as keyof T;
    const paramDefinition = paramEntry[1] as AlgorithmParamDefinition<any>;
    return (
      <Fragment key={String(paramName)}>
        <span className="text-slate-800">
          {String(paramName)}
          {paramDefinition.required && <span className="text-blue-500">*</span>}
        </span>
        {renderSelect(paramName, paramDefinition.type)}
      </Fragment>
    );
  });

  return <>{renderedParams}</>;
}
