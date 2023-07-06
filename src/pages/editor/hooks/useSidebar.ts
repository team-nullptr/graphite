import { useState, useEffect } from "react";

/** Internal hook that simplifies Sidebar component a little. */
export const useSidebar = () => {
  const [width, setWidth] = useState(600);
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
      setWidth(e.clientX);
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
