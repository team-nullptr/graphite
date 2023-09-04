import { Visualizer } from "./components/Visualizer";
import { EditorStoreProvider } from "./context/editor";
import { Tab, VerticalTabs } from "~/shared/layout/VerticalTab";
import { CommandLineIcon, PlayIcon } from "@heroicons/react/24/outline";
import { CodeEditor } from "~/features/code-editor/CodeEditor";
import { AlgorithmPicker } from "./components/AlgorithmPicker";
import { useState } from "react";
import { DynamicSplit } from "~/shared/layout/Split";

const tabs: Tab[] = [
  { id: "edit", icon: <CommandLineIcon />, element: <CodeEditor /> },
  { id: "algorithm", icon: <PlayIcon />, element: <AlgorithmPicker /> },
];

export function Editor() {
  const [currentTab, setCurrentTab] = useState<Tab>();

  const handleTabChange = (newTab: Tab) => {
    if (currentTab === newTab) {
      setCurrentTab(undefined);
    } else {
      setCurrentTab(newTab);
    }
  };

  return (
    <EditorStoreProvider projectId={""} loadingFallback={<>Loading ...</>}>
      <main className="flex h-screen w-screen overflow-y-auto">
        <VerticalTabs tabs={tabs} onTabChange={handleTabChange} currentTab={currentTab} />
        <DynamicSplit
          active={currentTab != undefined}
          dynamicPane={currentTab?.element}
          orientation="vertical"
          staticPane={<Visualizer />}
        />
      </main>
    </EditorStoreProvider>
  );
}
