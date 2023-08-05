import { Header } from "./components/Header";
import { Sidebar } from "./components/Sidebar";
import { Visualizer } from "./components/Visualizer";
import { EditorStoreProvider } from "./context/editor";
import { VerticalSplit } from "~/shared/layout/Split";

export const Editor = () => {
  return (
    <EditorStoreProvider projectId={""} loadingFallback={<>Loading ...</>}>
      <div className="flex h-screen w-screen flex-col">
        <Header name={""} onRename={undefined} />
        <main className="flex-grow overflow-y-auto">
          <VerticalSplit left={<Sidebar />} right={<Visualizer />} />
        </main>
      </div>
    </EditorStoreProvider>
  );
};
