import { ReactNode, useState } from "react";
import { cn } from "~/lib/utils";

export type Tab = {
  id: string;
  icon: ReactNode;
  element: ReactNode;
};

type TabIconProps = {
  tab: Tab;
  highlight: boolean;
  onClick: () => void;
};

const TabIcon = ({ tab, highlight, onClick }: TabIconProps) => {
  return (
    <div
      key={tab.id}
      className={`flex aspect-square w-full cursor-pointer items-center justify-center hover:bg-slate-100 ${
        highlight && "bg-slate-100"
      }`}
      onClick={onClick}
    >
      <div className="h-6 w-6 text-slate-800">{tab.icon}</div>
    </div>
  );
};

export type VerticalTabsProps = {
  tabs: Tab[];
};

export const VerticalTabs = (props: VerticalTabsProps) => {
  const [currentTab, setCurrentTab] = useState<Tab | undefined>(
    props.tabs.at(0)
  );

  const switchTab = (tabId: string) => {
    setCurrentTab(props.tabs.find((tab) => tab.id === tabId));
  };

  return (
    <div className="flex h-full w-full">
      <div className="flex w-12 flex-shrink-0 flex-col border-r border-r-slate-300 bg-slate-50">
        {props.tabs.map((tab) => (
          <TabIcon
            key={tab.id}
            tab={tab}
            onClick={() => switchTab(tab.id)}
            highlight={tab.id === currentTab?.id}
          />
        ))}
      </div>
      {props.tabs.map((tab) => (
        <div
          className={cn("w-full", currentTab?.id !== tab.id ? "hidden" : "")}
          key={tab.id}
        >
          {tab.element}
        </div>
      ))}
    </div>
  );
};
