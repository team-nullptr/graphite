import styles from "./Sidebar.module.css";

import { useEffect, useState, useMemo } from "react";

import ResizeIcon from "../../assets/more_vert_FILL0_wght200_GRAD0_opsz24.svg";
import ExpandIcon from "../../assets/keyboard_double_arrow_right_FILL0_wght200_GRAD0_opsz24.svg";

export const Sidebar = () => {
  const [width, setWidth] = useState(300);
  const [isResizing, setIsResizing] = useState(false);

  useEffect(() => {
    const stopResizing = () => setIsResizing(false);
    document.addEventListener("mouseup", stopResizing);

    return () => document.removeEventListener("mouseup", stopResizing);
  }, []);

  const handleResize = (e: MouseEvent) => {
    if (!isResizing) return;
    setWidth(e.clientX);
  };

  useEffect(() => {
    document.addEventListener("mousemove", handleResize);

    return () => document.removeEventListener("mousemove", handleResize);
  }, [isResizing]);

  const handleExpand = () => setWidth(400);

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
          />
          <div
            className={`${styles.resize} ${
              isResizing ? styles.resizeActive : ""
            }`}
            onMouseDown={() => setIsResizing(true)}
          >
            <img
              className={styles.resizeIcon}
              src={ResizeIcon}
              alt="resize"
              style={{ width: 24, height: 24 }}
              draggable="false"
            />
          </div>
        </>
      )}
    </div>
  );
};
