import { ArrowLeftIcon, PlayIcon } from "@heroicons/react/24/outline";
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

export interface AlgorithmDetails {
  algorithm: Algorithm<{}>;
  onBack: () => void;
}

export function AlgorithmDetails({ algorithm, onBack }: AlgorithmDetails) {
  const store = useEditorStore((storeState) => {
    const { graph, setMode, algorithmParams, setAlgorithmParams } = storeState;
    return { graph, setMode, paramsValue: algorithmParams, setParamsValue: setAlgorithmParams };
  });

  const handleBackClicked = () => {
    store.setMode({ type: "IDLE" });
    store.setParamsValue({});
    onBack();
  };

  const handleSetParamsValue = (
    paramName: keyof (typeof algorithm)["params"],
    newParamValue: string
  ) => {
    store.setParamsValue({ ...store.paramsValue, [paramName]: newParamValue });
  };

  const isParamValueValid = useMemo(() => {
    return validateAlgorithmParams(algorithm.params, store.paramsValue as Record<string, string>);
  }, [store.paramsValue]);

  const loadSteps = () => {
    if (!isParamValueValid) return;
    // @ts-ignore
    const steps = algorithm.stepGenerator(store.graph, store.paramsValue);
    store.setMode({ type: "SIMULATION", steps });
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
            <AlgorithmDetailParams<{}>
              paramDefinitions={algorithm.params}
              value={store.paramsValue}
              availableVertices={Object.values(store.graph.vertices)}
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
