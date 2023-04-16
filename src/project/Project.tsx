import { useState } from "react";
import { Simulator } from "../simulator/Simulator";
import styles from "./Project.module.css";
import { Header } from "./components/Header";
import { Timeline } from "./components/Timeline";

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

  const edges = [
    { id: "e-1", a: "v-1", b: "v-2", directed: true },
    { id: "e-2", a: "v-2", b: "v-3", directed: true },
    { id: "e-3", a: "v-3", b: "v-4", directed: true },
    { id: "e-4", a: "v-4", b: "v-5", directed: true },
    { id: "e-5", a: "v-5", b: "v-1", directed: true },
    { id: "e-6", a: "v-2", b: "v-4", directed: true },
    { id: "e-7", a: "v-4", b: "v-2", directed: true },
  ];

  return (
    <main className={styles.container}>
      <Header name={projectName} onRename={setProjectName} />
      <Timeline
        currentStep={currentStep}
        stepCount={7}
        onStepChange={stepChangeHandler}
        onStop={stopHandler}
      />
      <Simulator
        graph={{
          vertices: [
            { id: "v-1", value: 1 },
            { id: "v-2", value: 2 },
            { id: "v-3", value: 3 },
            { id: "v-4", value: 4 },
            { id: "v-5", value: 5 },
          ],
          edges: edges.slice(0, currentStep),
        }}
        arrangement={{
          "v-1": [200, 200],
          "v-2": [300, 200],
          "v-3": [300, 300],
          "v-4": [150, 250],
          "v-5": [100, 200],
        }}
      />
    </main>
  );
};
