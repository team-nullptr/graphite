import { useEffect, useState } from "react";
import { GraphView } from "../features/graph-view/GraphView";
import { useEditorStore } from "../context/editor";
import { Timeline } from "./Timeline";

export const Visualizer = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const instructions = useEditorStore((state) => state.instructions);

  // TODO: We might want to do this differently
  useEffect(() => {
    setCurrentStep(0);
  }, [instructions]);

  const currentInstruction = instructions[currentStep];

  return (
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
  );
};
