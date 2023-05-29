import { useNavigate, useParams } from "react-router-dom";
import { useTheme } from "../../context/theme";
import { VerticalSplit } from "../../shared/layout/VerticalSplit";
import { GraphView } from "../graph-view/GraphView";
import { Header } from "./components/Header";
import { Timeline } from "./components/Timeline";
import { EditorStoreProvider, useEditorStore } from "./context/editor";
import { CommandLineIcon, PlayIcon } from "@heroicons/react/24/outline";
import { Tab, VerticalTabs } from "../../shared/layout/VerticalTab";
import { CodeEditor } from "../code-editor/CodeEditor";
import { AlgorithmPicker } from "./components/AlgorithmPicker";
import { useEffect, useState } from "react";
import { HorizontalSplit } from "../../shared/layout/HorizontalSplit";

export const Editor = () => {
  const { projectId } = useParams<"projectId">();
  const { themeClass } = useTheme();
  const navigate = useNavigate();

  const handleNavigateUp = () => {
    navigate("..");
  };

  return (
    <EditorStoreProvider
      projectId={projectId ?? ""}
      loadingFallback={<>Loading ...</>}
    >
      <div className={`flex h-full flex-col ${themeClass}`}>
        <Header
          name={""}
          onRename={undefined}
          onNavigateUp={handleNavigateUp}
        />
        <div className="flex-1">
          <main className="h-full max-h-full">
            <VerticalSplit left={<Sidebar />} right={<Visualizer />} />
          </main>
        </div>
      </div>
    </EditorStoreProvider>
  );
};

// Sidebar

const sidebarTabs: Tab[] = [
  { id: "edit", icon: <CommandLineIcon />, element: <CodeEditor /> },
  {
    id: "algorithm",
    icon: <PlayIcon />,
    element: <AlgorithmPicker />,
  },
];

const Sidebar = () => {
  return <VerticalTabs tabs={sidebarTabs} />;
};

// Visualizer

const Visualizer = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const instructions = useEditorStore((state) => state.instructions);

  // TODO: We might want to do this differently
  useEffect(() => {
    setCurrentStep(0);
  }, [instructions]);

  const currentInstruction = instructions[currentStep];

  return (
    <HorizontalSplit
      top={
        <div className="flex h-full flex-col">
          <Timeline
            currentStep={currentStep}
            onStepChange={setCurrentStep}
            maxStep={instructions.length - 1}
          />
          <div className="flex-grow">
            <GraphView highlights={currentInstruction?.highlights} />
          </div>
        </div>
      }
      bottom={<div>{currentInstruction?.description}</div>}
    />
  );
};
