import { useState } from "react";
import { Simulator } from "../simulator/Simulator";
import styles from "./Project.module.css";
import { Header } from "./components/Header";
import { Timeline } from "./components/Timeline";
import { Graph } from "../engine/graph";
import { Sidebar } from "./components/Sidebar";

/** This is a temporary solution to get a test graph. */
const buildGraph = (): Graph => {
  const graph = new Graph();

  const v1 = graph.addVertex(1);
  const v2 = graph.addVertex(2);

  graph.addDirectedEdge(v1, v2, 10);
  graph.addDirectedEdge(v1, v2, 5);
  graph.addDirectedEdge(v2, v1, 20);

  return graph;
};

const graph = buildGraph();

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
        stepCount={7}
        onStepChange={stepChangeHandler}
        onStop={stopHandler}
      />
      <Sidebar></Sidebar>
      <Simulator
        graph={graph}
        arrangement={{
          "v-0": [200, 200],
          "v-1": [300, 200],
        }}
      />
    </main>
  );
};
