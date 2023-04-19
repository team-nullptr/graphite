import styles from "./Sidebar.module.css";

import { useEffect, useState } from "react";

import ResizeIcon from "../../assets/more_vert_FILL0_wght200_GRAD0_opsz24.svg";

export const Sidebar = () => {
  const [width, setWidth] = useState(300);
  const [isResizing, setIsResizing] = useState(false);

  // TODO: Add behaviour similar to leet's code sidebar (stop resizing at specified witdth and then fully close)

  useEffect(() => {
    const handler = () => setIsResizing(false);
    document.addEventListener("mouseup", handler);
    return () => document.removeEventListener("mouseup", handler);
  }, []);

  useEffect(() => {
    document.addEventListener("mousemove", handleResize);
    return () => document.removeEventListener("mousemove", handleResize);
  }, [isResizing]);

  const handleResize = (e: MouseEvent) => {
    if (!isResizing) {
      return;
    }

    console.log(e.clientX);
    setWidth(e.clientX);
  };

  return (
    <div className={styles.sidebar} style={{ width: Math.max(width, 5) }}>
      <div className={styles.resize} onMouseDown={() => setIsResizing(true)}>
        <img
          className={styles.resizeIcon}
          src={ResizeIcon}
          alt="resize"
          style={{ width: 24, height: 24 }}
          draggable="false"
        />
      </div>
    </div>
  );
};
