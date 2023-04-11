import { useState } from "react";
import { Timeline } from "./components/Timeline";
import styles from "./Project.module.css";
import { Header } from "./components/Header";

export interface ProjectProps {
  readonly id: string;
}

export const Project = (props: ProjectProps) => {
  const [currentStep, setCurrentStep] = useState(1);

  const stepChangeHandler = (step: number) => {
    setCurrentStep(step);
  };

  const stopHandler = () => {
    console.log("stopped");
  };

  const [projectName, setProjectName] = useState("");

  return (
    <main className={styles.container}>
      <Header name={projectName} onRename={setProjectName} />
      <Timeline
        currentStep={currentStep}
        stepCount={10}
        onStepChange={stepChangeHandler}
        onStop={stopHandler}
      />
    </main>
  );
};
