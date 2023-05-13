import { useEffect, useState } from "react";
import { Simulator } from "../simulator/Simulator";
import { Header } from "./components/Header";
import { Sidebar } from "./components/Sidebar";
import { Timeline } from "./components/Timeline";
import { VerticalSplit } from "../../shared/VerticalSplit";
import { useTheme } from "../../context/theme";

export interface EditorProps {
  stepCount: number;
}

export const Editor = ({ stepCount }: EditorProps) => {
  const [projectName, setProjectName] = useState("");
  const [playing, setPlaying] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const { themeClass } = useTheme();

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
    <div className={`flex h-full flex-col ${themeClass}`}>
      <Header name={projectName} onRename={setProjectName} />
      <div className="flex-1">
        <main className="h-full max-h-full">
          <VerticalSplit
            left={<Sidebar />}
            right={
              <div className="flex h-full flex-col">
                <Timeline
                  playing={playing}
                  currentStep={currentStep}
                  stepCount={stepCount}
                  onStepChange={stepChangeHandler}
                  onStart={startHandler}
                  onStop={stopHandler}
                />
                <div className="flex-grow">
                  <Simulator />
                </div>
              </div>
            }
          />
        </main>
      </div>
    </div>
  );
};
