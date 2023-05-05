import { CodeEditor } from "../../code-editor/CodeEditor";
import { ChevronDoubleRightIcon } from "@heroicons/react/24/outline";
import { useSidebar } from "../hooks/useSidebar";

// TODO: Abstract this behaviours to make sections resizable (Like editor section / algorithm picker section)

type SidebarHandleProps = {
  isResizing: boolean;
  onResize: () => void;
};

const SidebarHandle = (props: SidebarHandleProps) => {
  return (
    <div
      className="flex h-full w-2 flex-col items-center justify-center bg-debug opacity-50 hover:cursor-col-resize"
      onMouseDown={() => props.onResize()}
    />
  );
};

export const Sidebar = () => {
  const { width, isResizing, setIsResizing, handleExpand } = useSidebar();

  return (
    <div className="row-span-2 flex border-r border-base-300">
      {width < 100 ? (
        <div
          className="flex h-full w-[24px] cursor-pointer flex-col items-center justify-center bg-base-200"
          onClick={handleExpand}
        >
          <ChevronDoubleRightIcon />
        </div>
      ) : (
        <>
          <div
            className="h-full"
            style={{
              width: width,
            }}
          >
            <CodeEditor></CodeEditor>
          </div>
          <SidebarHandle
            isResizing={isResizing}
            onResize={() => setIsResizing(true)}
          />
        </>
      )}
    </div>
  );
};
