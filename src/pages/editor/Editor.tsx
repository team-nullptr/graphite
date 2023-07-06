import { useNavigate, useParams } from "react-router-dom";
import { useTheme } from "../../context/theme";
import { VerticalSplit } from "../../layout/VerticalSplit";
import { Header } from "./components/Header";
import { Sidebar } from "./components/Sidebar";
import { Visualizer } from "./components/Visualizer";
import { EditorStoreProvider } from "./context/editor";

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
