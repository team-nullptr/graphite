import { useEffect, useRef, useState } from "react";
import { GraphView } from "../features/graph-view/GraphView";
import { useEditorStore } from "../context/editor";
import { BottomPane } from "~/shared/layout/BottomPane";
import { Timeline } from "./Timeline";

export const Visualizer = () => {
  const visualizerRef = useRef(null);

  const [currentStepIndex, setCurrentStep] = useState(0);

  const { mode, graph } = useEditorStore(({ mode, graph }) => ({
    mode,
    graph,
  }));

  // TODO: We might want to do this differently
  useEffect(() => {
    setCurrentStep(0);
  }, [mode]);

  const highlights =
    mode.mode === "SIMULATION"
      ? mode.steps[currentStepIndex].highlights
      : undefined;

  return (
    <div className="relative h-full w-full" ref={visualizerRef}>
      <GraphView
        graph={graph}
        className="h-full w-full"
        highlights={highlights}
      />

      {mode.mode === "SIMULATION" && (
        <BottomPane parentRef={visualizerRef}>
          <Timeline
            currentStep={currentStepIndex}
            onStepChange={setCurrentStep}
            maxStep={mode.steps.length - 1}
          />
          <div className="bg-base-200 dark:bg-base-300-dark h-full w-full">
            {mode.steps[currentStepIndex].description}
            <div
              dangerouslySetInnerHTML={{
                __html: mode.steps[currentStepIndex].stepState.replaceAll(
                  /,(?=\[)/g,
                  "<br/>"
                ),
              }}
            />
          </div>
        </BottomPane>
      )}
    </div>
  );
};
