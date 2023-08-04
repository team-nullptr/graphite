import { useEffect, useRef, useState, Fragment } from "react";
import { BottomPane } from "~/shared/layout/BottomPane";
import { useEditorStore } from "../context/editor";
import { GraphView } from "../../../features/graph-view/GraphView";
import { TableStep } from "./TableStep";
import { AlgorithmControls } from "./AlgorithmControls";
import { State } from "~/core/simulator/algorithm";
import { ArrayStep } from "./ArrayStep";

export const Visualizer = () => {
  const visualizerRef = useRef(null);

  const { mode, graph } = useEditorStore(({ mode, graph }) => ({
    mode,
    graph,
  }));

  const [currentStepIndex, setCurrentStep] = useState(0);

  // TODO: We might want to do this differently
  useEffect(() => {
    setCurrentStep(0);
  }, [mode]);

  const highlights =
    mode.type === "SIMULATION"
      ? mode.steps[currentStepIndex].highlights
      : undefined;

  const renderStepState = (state: State) => {
    if (!state) return null;

    switch (state.type) {
      case "table":
        return <TableStep state={state} />;
      case "array":
        console.log("rendering array");
        return <ArrayStep state={state} />;
      default:
        return null;
    }
  };

  return (
    <div className="relative flex h-full w-full flex-col" ref={visualizerRef}>
      <GraphView
        graph={graph}
        className="h-full w-full"
        highlights={highlights}
      />
      {mode.type === "SIMULATION" && (
        <BottomPane parentRef={visualizerRef}>
          <div className="flex h-full w-full flex-col">
            <AlgorithmControls
              currentStep={currentStepIndex}
              onStepChange={setCurrentStep}
              numberOfSteps={mode.steps.length}
              playerSettings={{
                speed: 1.5 * 1000,
              }}
            />
            <div className="flex flex-col gap-1 p-4">
              <span className="font-bold text-slate-800">
                Step {currentStepIndex + 1} / {mode.steps.length}
              </span>
              <p className="text-slate-800">
                {mode.steps[currentStepIndex].description}
              </p>
            </div>
            {mode.steps[currentStepIndex].state.map((s, i) => (
              <Fragment key={i}>{renderStepState(s)}</Fragment>
            ))}
          </div>
        </BottomPane>
      )}
    </div>
  );
};
