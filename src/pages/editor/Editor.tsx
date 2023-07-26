import { useNavigate, useParams } from "react-router-dom";
import { useTheme } from "~/context/theme";
import { VerticalSplit } from "~/shared/layout/VerticalSplit";
import { Header } from "./components/Header";
import { Sidebar } from "./components/Sidebar";
import { Visualizer } from "./components/Visualizer";
import { EditorStoreProvider } from "./context/editor";

export const Editor = () => {
  const { themeClass } = useTheme();

  return (
    <EditorStoreProvider projectId={""} loadingFallback={<>Loading ...</>}>
      <div className={`flex h-screen flex-col overflow-hidden ${themeClass}`}>
        <Header name={""} onRename={undefined} />
        <main className="h-[calc(100vh_-_48px)]">
          <VerticalSplit left={<Sidebar />} right={<Visualizer />} />
        </main>
      </div>
    </EditorStoreProvider>
  );
};
