import { useNavigate, useParams } from "react-router-dom";
import { useTheme } from "../../context/theme";
import { VerticalSplit } from "../../shared/layout/VerticalSplit";
import { Simulator } from "../simulator/Simulator";
import { Header } from "./components/Header";
import { Timeline } from "./components/Timeline";
import { EditorStoreProvider } from "./context/editor";
import { CommandLineIcon, PlayIcon } from "@heroicons/react/24/outline";
import { Tab, VerticalTabs } from "../../shared/layout/VerticalTab";
import { CodeEditor } from "../code-editor/CodeEditor";
import { AlgorithmPicker } from "./components/AlgorithmPicker";

const sidebarTabs: Tab[] = [
  { id: "edit", icon: <CommandLineIcon />, element: <CodeEditor /> },
  {
    id: "algorithm",
    icon: <PlayIcon />,
    element: <AlgorithmPicker />,
  },
];

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
            <VerticalSplit
              left={<VerticalTabs tabs={sidebarTabs} />}
              right={
                <div className="flex h-full flex-col">
                  <Timeline
                    playing={false}
                    currentStep={0}
                    stepCount={0}
                    onStepChange={undefined}
                    onStart={undefined}
                    onStop={undefined}
                  />
                  <div className="flex-grow">
                    <Simulator />
                  </div>
                </div>
              }
            />
          </main>
        </div>
      </div>
    </EditorStoreProvider>
  );
};
