import { useState } from "react";
import { Timeline } from "./components/Timeline";
import styles from "./Project.module.css";
import { Header } from "./components/Header";
import { Simulator } from "../simulator/Simulator";

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
      <Simulator
        graph={{
          vertices: [
            { id: "v-1", value: 1 },
            { id: "v-2", value: 2 },
          ],
          edges: [{ id: "e-1", a: "v-1", b: "v-2", directed: true }],
        }}
        arrangement={{
          "v-1": [50, 100],
          "v-2": [150, 100],
        }}
      />
    </main>
  );
};
