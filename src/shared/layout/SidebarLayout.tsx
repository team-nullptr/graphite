import { CommandLineIcon, PlayIcon } from "@heroicons/react/24/outline";
import { PropsWithChildren, useState } from "react";
import { cn } from "~/lib/utils";
import { AlgorithmPicker } from "~/pages/editor/components/AlgorithmPicker";
import { DynamicSplit } from "~/shared/layout/Split";
import { Tab, VerticalTabs } from "~/shared/layout/VerticalTab";
import { CodeEditor } from "../../features/code-editor/CodeEditor";
import { useEditorStore } from "~/pages/editor/context/editor";

const tabs: Tab[] = [
  { id: "edit", icon: <CommandLineIcon />, element: <CodeEditor /> },
  {
    id: "algorithm",
    icon: <PlayIcon />,
    element: <AlgorithmPicker />,
  },
];

export type SidebarLayoutProps = PropsWithChildren;

export const SidebarLayout = ({ children }: SidebarLayoutProps) => {
  const setMode = useEditorStore(({ setMode }) => setMode);
  const [currentTab, setCurrentTab] = useState<Tab | undefined>(tabs[0]);

  const onTabChange = (tab: Tab) => {
    if (tab.id === currentTab?.id) {
      setCurrentTab(undefined);

      if (tab.id === "algorithm") {
        setMode({ type: "IDLE" });
      }

      return;
    }

    setCurrentTab(tab);
  };

  return (
    <div className="flex h-full w-full">
      <VerticalTabs
        tabs={tabs}
        currentTab={currentTab}
        onTabChange={onTabChange}
      />
      <DynamicSplit
        orientation="vertical"
        initialShare={75}
        active={!!currentTab}
        dynamicPane={tabs.map((tab) => (
          <div
            key={tab.id}
            className={cn(
              "h-full w-full",
              tab.id !== currentTab?.id && "hidden"
            )}
          >
            {tab.element}
          </div>
        ))}
        staticPane={children}
      />
    </div>
  );
};
