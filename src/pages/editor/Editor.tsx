import { SidebarLayout } from "~/shared/layout/SidebarLayout";
import { Header } from "./components/Header";
import { Visualizer } from "./components/Visualizer";
import { EditorStoreProvider } from "./context/editor";

export const Editor = () => {
  return (
    <EditorStoreProvider projectId={""} loadingFallback={<>Loading ...</>}>
      <div className="flex h-screen w-screen flex-col">
        <Header name={""} onRename={undefined} className="flex-shrink-0" />
        <main className="flex-grow overflow-y-auto">
          <SidebarLayout>
            <Visualizer />
          </SidebarLayout>
        </main>
      </div>
    </EditorStoreProvider>
  );
};
