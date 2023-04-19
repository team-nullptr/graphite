import { useEffect, useState } from "react";
import { Simulator } from "../simulator/Simulator";
import styles from "./Project.module.css";
import { Header } from "./components/Header";
import { Timeline } from "./components/Timeline";
import { Graph } from "../engine/graph";
import { Sidebar } from "./components/Sidebar";
import { unstable_renderSubtreeIntoContainer } from "react-dom";

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
  graph.addDirectedEdge(v5, v1, 100);
  graph.addDirectedEdge(v5, v1, 100);
  graph.addDirectedEdge(v5, v1, 100);
  graph.addDirectedEdge(v5, v1, 100);
  graph.addDirectedEdge(v5, v1, 100);
  graph.addDirectedEdge(v5, v1, 100);

  return graph;
};

const graph = buildGraph();

export interface ProjectProps {
  readonly id: string;
}

const stepCount = 7;

export const Project = (props: ProjectProps) => {
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
    <main className={styles.container}>
      <Sidebar />
      <Header name={projectName} onRename={setProjectName} />
      <Timeline
        playing={playing}
        currentStep={currentStep}
        stepCount={stepCount}
        onStepChange={stepChangeHandler}
        onStart={startHandler}
        onStop={stopHandler}
      />
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
