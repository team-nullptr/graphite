import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useTheme } from "../../context/theme";
import { VerticalSplit } from "../../shared/VerticalSplit";
import { useProjectStore } from "../../store/project";
import { Simulator } from "../simulator/Simulator";
import { AlgorithmDetails } from "./components/AlgorithmDetails";
import { AlgorithmGrid } from "./components/AlgorithmGrid";
import { Header } from "./components/Header";
import { Timeline } from "./components/Timeline";
import { AlgorithmWithValidator } from "./models/Algorithm";

const algorithms: AlgorithmWithValidator[] = [
  { id: "a-1", name: "DFS", isValid: () => true },
  { id: "a-2", name: "BFS", isValid: () => true },
];

export const Editor = () => {
  const { projectId } = useParams();
  const { themeClass } = useTheme();

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
        <Simulator graph={project.graph} />
      </div>
    </div>
  );

  return (
    <div className={`flex h-full flex-col ${themeClass}`}>
      <Header
        name={project.name}
        onRename={handleProjectRename}
        onNavigateUp={handleNavigateUp}
      />
      <div className="flex-1">
        <main className="h-full max-h-full">
          <VerticalSplit left={sidebarContent} right={mainContent} />
        </main>
      </div>
    </div>
  );
};
