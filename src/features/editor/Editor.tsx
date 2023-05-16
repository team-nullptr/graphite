import { useState } from "react";
import { HorizontalSplit } from "../../shared/SplitLayout";
import { useProjectStore } from "../../store/project";
import { Simulator } from "../simulator/Simulator";
import { AlgorithmGrid } from "./components/AlgorithmGrid";
import { Header } from "./components/Header";
import { Timeline } from "./components/Timeline";
import { AlgorithmWithValidator } from "./models/Algorithm";
import { AlgorithmDetails } from "./components/AlgorithmDetails";

export interface EditorProps {}

const algorithms: AlgorithmWithValidator[] = [
  { id: "a-1", name: "DFS", isValid: () => true },
  { id: "a-2", name: "BFS", isValid: () => true },
];

export const Editor = ({}: EditorProps) => {
  const [projectName, setProjectName] = useState("");
  const graph = useProjectStore((store) => store.graph);

  const [selectedAlgorithm, setSelectedAlgorithm] =
    useState<AlgorithmWithValidator | null>(null);

  const backClickHandler = () => {
    setSelectedAlgorithm(null);
  };

  const algorithmSelectHandler = (algorithm: AlgorithmWithValidator) => {
    setSelectedAlgorithm(algorithm);
  };

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

  return (
    <div className="flex h-full flex-col">
      <Header name={projectName} onRename={setProjectName} />
      <main className="flex-grow">
        <HorizontalSplit
          left={sidebarContent}
          right={
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
          }
        />
      </main>
    </div>
  );
};
