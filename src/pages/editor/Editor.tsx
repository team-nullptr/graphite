import { Header } from "./components/Header";
import { Sidebar } from "./components/Sidebar";
import { Visualizer } from "./components/Visualizer";
import { EditorStoreProvider } from "./context/editor";
import { Split } from "~/shared/layout/Split";

export const Editor = () => {
  return (
    <EditorStoreProvider projectId={""} loadingFallback={<>Loading ...</>}>
      <div className="flex h-screen w-screen flex-col">
        <Header name={""} onRename={undefined} className="flex-shrink-0" />
        <main className="flex-grow overflow-y-auto">
          <Split
            orientation="vertical"
            first={<Sidebar />}
            second={<Visualizer />}
          />
        </main>
      </div>
    </EditorStoreProvider>
  );
};
