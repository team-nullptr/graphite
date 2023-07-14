import { useEffect, useState } from "react";
import { GraphView } from "../features/graph-view/GraphView";
import { useEditorStore } from "../context/editor";
import { Timeline } from "./Timeline";
import { HorizontalSplit } from "../../../layout/HorizontalSplit";

export const Visualizer = () => {
  const [currentStepIndex, setCurrentStep] = useState(0);

  const { mode, graph } = useEditorStore(({ mode, graph }) => ({
    mode,
    graph,
  }));

  // TODO: We might want to do this differently
  useEffect(() => {
    setCurrentStep(0);
  }, [mode]);

  if (mode.mode === "IDLE") {
    return <GraphView graph={graph} className="h-full w-full" />;
  }

  const currentStep = mode.steps[currentStepIndex];

  return (
    <HorizontalSplit
      top={
        <div className="flex h-full flex-col">
          <GraphView
            graph={graph}
            className="h-full w-full"
            highlights={currentStep?.highlights}
          />
          <Timeline
            currentStep={currentStepIndex}
            onStepChange={setCurrentStep}
            maxStep={mode.steps.length - 1}
          />
        </div>
      }
      bottom={
        <div className="bg-base-200 dark:bg-base-300-dark h-full w-full">
          {currentStep?.description}
          <div
            dangerouslySetInnerHTML={{
              __html: currentStep?.stepState.replaceAll(/,(?=\[)/g, "<br/>"),
            }}
          />
        </div>
      }
    />
  );
};
