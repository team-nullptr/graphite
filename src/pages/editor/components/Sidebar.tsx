import { CommandLineIcon, PlayIcon } from "@heroicons/react/24/outline";
import { Tab, VerticalTabs } from "~/shared/layout/VerticalTab";
import { CodeEditor } from "../features/code-editor/CodeEditor";
import { AlgorithmPicker } from "./AlgorithmPicker";

const sidebarTabs: Tab[] = [
  { id: "edit", icon: <CommandLineIcon />, element: <CodeEditor /> },
  {
    id: "algorithm",
    icon: <PlayIcon />,
    element: <AlgorithmPicker />,
  },
];

export const Sidebar = () => {
  return <VerticalTabs tabs={sidebarTabs} />;
};
