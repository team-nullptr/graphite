import { VerticalSplit } from "~/shared/layout/VerticalSplit";
import { Header } from "./components/Header";
import { Sidebar } from "./components/Sidebar";
import { Visualizer } from "./components/Visualizer";
import { EditorStoreProvider } from "./context/editor";

export const Editor = () => {
  return (
    <EditorStoreProvider projectId={""} loadingFallback={<>Loading ...</>}>
      <div className={`flex h-screen flex-col`}>
        <Header name={""} onRename={undefined} />
        <main className="min-h-0 flex-grow">
          <VerticalSplit left={<Sidebar />} right={<Visualizer />} />
        </main>
      </div>
    </EditorStoreProvider>
  );
};
