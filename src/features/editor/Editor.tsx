import { useEffect, useState } from "react";
import { HorizontalSplit } from "../../shared/SplitLayout";
import { useProjectStore } from "../../store/project";
import { Simulator } from "../simulator/Simulator";
import { AlgorithmGrid } from "./components/AlgorithmGrid";
import { Header } from "./components/Header";
import { Timeline } from "./components/Timeline";
import { AlgorithmWithValidator } from "./models/Algorithm";
import { AlgorithmDetails } from "./components/AlgorithmDetails";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const algorithms: AlgorithmWithValidator[] = [
  { id: "a-1", name: "DFS", isValid: () => true },
  { id: "a-2", name: "BFS", isValid: () => true },
];

export const Editor = () => {
  const { projectId } = useParams();

  const store = useProjectStore();
  const project = store.projects.get(projectId!);

  if (!project) {
    return <h1>Project not found</h1>;
  }

  const navigate = useNavigate();

  const handleNavigateUp = () => {
    navigate("..");
  };

  const handleProjectRename = (newProjectName: string) => {
    store.updateProject({ ...project, name: newProjectName });
  };

  const [selectedAlgorithm, setSelectedAlgorithm] =
    useState<AlgorithmWithValidator | null>(null);

  const backClickHandler = () => {
    setSelectedAlgorithm(null);
  };

  const algorithmSelectHandler = (algorithm: AlgorithmWithValidator) => {
    setSelectedAlgorithm(algorithm);
  };

  const graph = project.graph;
  const sidebarContent = selectedAlgorithm ? (
    <AlgorithmDetails
      algorithm={selectedAlgorithm}
      onBackClick={backClickHandler}
      invalid={!selectedAlgorithm.isValid?.(graph)}
    />
  ) : (
    <AlgorithmGrid
      graph={graph}
      algorithms={algorithms}
      onAlgorithmSelect={algorithmSelectHandler}
    />
  );

  const mainContent = (
    <div className="flex h-full flex-col">
      <Timeline
        playing={false}
        currentStep={0}
        stepCount={0}
        onStepChange={() => {}}
        onStart={() => {}}
        onStop={() => {}}
      />
      <div className="flex-grow">
        <Simulator />
      </div>
    </div>
  );

  return (
    <div className="flex h-full flex-col">
      <Header
        name={project.name}
        onRename={handleProjectRename}
        onNavigateUp={handleNavigateUp}
      />
      <main className="flex-grow">
        <HorizontalSplit left={sidebarContent} right={mainContent} />
      </main>
    </div>
  );
};
