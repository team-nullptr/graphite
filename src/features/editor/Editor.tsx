import { useEffect, useState } from "react";
import { Simulator } from "../simulator/Simulator";
import { Header } from "./components/Header";
import { Sidebar } from "./components/Sidebar";
import { Timeline } from "./components/Timeline";

export interface EditorProps {
  readonly id: string;
}

const stepCount = 7;

export const Editor = (props: EditorProps) => {
  const [projectName, setProjectName] = useState("");
  const [playing, setPlaying] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  useEffect(() => {
    if (!playing) {
      return;
    }

    const stepInterval = setInterval(
      () => setCurrentStep((step) => Math.min(step + 1, stepCount)),
      1000
    );

    return () => clearInterval(stepInterval);
  }, [playing]);

  const stepChangeHandler = (step: number) => setCurrentStep(step);

  const stopHandler = () => {
    setPlaying(false);
    console.log("stopped");
  };

  const startHandler = () => {
    setPlaying(true);
    console.log("started");
  };

  return (
    <main className="grid h-full grid-cols-[auto_1fr] grid-rows-[auto_auto_1fr]">
      <Header name={projectName} onRename={setProjectName} />
      <Sidebar />
      <Timeline
        playing={playing}
        currentStep={currentStep}
        stepCount={stepCount}
        onStepChange={stepChangeHandler}
        onStart={startHandler}
        onStop={stopHandler}
      />
      <Simulator />
    </main>
  );
};
