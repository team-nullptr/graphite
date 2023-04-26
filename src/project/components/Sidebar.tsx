import { useEffect, useState, useMemo } from "react";
import ExpandIcon from "../../assets/keyboard_double_arrow_right_FILL0_wght200_GRAD0_opsz24.svg";
import { CodeEditor } from "../../features/code-editor/CodeEditor";
import styles from "./Sidebar.module.css";

// TODO: Make sections resizable (Like editor section / algorithm picker section)

/** Internal hook that simplifies Sidebar component a little. */
const useSidebar = () => {
  const [width, setWidth] = useState(300);
  const [isResizing, setIsResizing] = useState(false);

  useEffect(() => {
    const stopResizing = () => {
      setIsResizing(false);
    };

    document.addEventListener("mouseup", stopResizing);
    return () => document.removeEventListener("mouseup", stopResizing);
  }, []);

  useEffect(() => {
    const handleResize = (e: MouseEvent) => {
      if (!isResizing) return;
      // TODO: Make this work on different screen sizes
      setWidth(Math.min(e.clientX, 600));
    };

    document.addEventListener("mousemove", handleResize);
    return () => document.removeEventListener("mousemove", handleResize);
  }, [isResizing]);

  const handleExpand = () => setWidth(400);

  return {
    width,
    isResizing,
    setIsResizing,
    handleExpand,
  };
};

type SidebarHandleProps = {
  isResizing: boolean;
  onResize: () => void;
};

const SidebarHandle = (props: SidebarHandleProps) => {
  const handleStyles = useMemo(
    () => `${styles.resize} ${props.isResizing ? styles.resizeActive : ""}`,
    [props.isResizing]
  );

  return <div className={handleStyles} onMouseDown={() => props.onResize()} />;
};

export const Sidebar = () => {
  const { width, isResizing, setIsResizing, handleExpand } = useSidebar();

  return (
    <div className={styles.sidebar}>
      {width < 100 ? (
        <div className={styles.sidebarExpand} onClick={handleExpand}>
          <img
            className={styles.sidebarExpandIcon}
            src={ExpandIcon}
            alt="expand"
            style={{ width: 24, height: 24 }}
          />
        </div>
      ) : (
        <>
          <div
            className={styles.sidebarContent}
            style={{
              width: Math.max(width, 350),
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
