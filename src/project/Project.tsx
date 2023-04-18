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
  const v3 = graph.addVertex(3);
  const v4 = graph.addVertex(4);
  const v5 = graph.addVertex(5);

  graph.addDirectedEdge(v1, v2, 10);
  graph.addDirectedEdge(v2, v4, 10);
  graph.addDirectedEdge(v2, v3, 10);
  graph.addDirectedEdge(v3, v4, 20);
  graph.addDirectedEdge(v4, v5, 10);
  graph.addDirectedEdge(v4, v2, 10);
  graph.addDirectedEdge(v5, v1, 100);

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
          "v-0": [300, 200],
          "v-1": [400, 200],
          "v-2": [400, 400],
          "v-3": [250, 300],
          "v-4": [200, 200],
        }}
      />
    </main>
  );
};
