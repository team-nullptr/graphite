import { useEffect, useMemo, useState } from "react";
import { GraphView } from "../features/graph-view/GraphView";
import { useEditorStore } from "../context/editor";
import { Timeline } from "./Timeline";
import { HorizontalSplit } from "../../../layout/HorizontalSplit";

export const Visualizer = () => {
  const [currentStep, setCurrentStep] = useState(0);

  const { algorithm, graph } = useEditorStore(({ algorithm, graph }) => ({
    algorithm,
    graph,
  }));

  const instructions = useMemo(
    () => algorithm?.instructionsResolver(graph) ?? [],
    [algorithm, graph]
  );

  // TODO: We might want to do this differently
  useEffect(() => {
    setCurrentStep(0);
  }, [instructions]);

  const currentInstruction = instructions[currentStep];

  return (
    <HorizontalSplit
      top={
        <div className="flex h-full flex-col">
          <Timeline
            currentStep={currentStep}
            onStepChange={setCurrentStep}
            maxStep={instructions.length - 1}
          />
          <GraphView
            className="h-full w-full"
            highlights={currentInstruction?.highlights}
          />
        </div>
      }
      bottom={
        <div className="bg-base-200 dark:bg-base-300-dark h-full w-full">
          {currentInstruction?.description}
          <div
            dangerouslySetInnerHTML={{
              __html: currentInstruction?.stepState.replaceAll(
                /,(?=\[)/g,
                "<br/>"
              ),
            }}
          />
        </div>
      }
    />
  );
};
