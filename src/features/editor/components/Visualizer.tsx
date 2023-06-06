import { BookOpenIcon } from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";
import { Tab } from "../../../shared/Tab";
import { HorizontalSplit } from "../../../shared/layout/HorizontalSplit";
import { GraphView } from "../../graph-view/GraphView";
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
    <HorizontalSplit
      top={
        <div className="flex h-full flex-col">
          <Timeline
            currentStep={currentStep}
            onStepChange={setCurrentStep}
            maxStep={instructions.length - 1}
          />
          <div className="flex-grow">
            <GraphView highlights={currentInstruction?.highlights} />
          </div>
        </div>
      }
      bottom={
        <Tab label="Steps" icon={<BookOpenIcon className="h-4 w-4" />}>
          <div className="h-full w-full bg-base-200 dark:bg-base-300-dark">
            {currentInstruction?.description}
            <br />
            <br />
            <br />
            <div
              dangerouslySetInnerHTML={{
                __html: currentInstruction?.stepState.replaceAll(
                  /,(?=\[)/g,
                  "<br/>"
                ),
              }}
            ></div>
          </div>
        </Tab>
      }
    />
  );
};
