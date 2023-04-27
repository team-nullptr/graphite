import { useEffect, useState } from "react";
import styles from "./CodeEdtor.module.css";
import "./editor-styles.css";
import { editorOnChange, useEditor } from "./hooks/useEditor";

export const CodeEditor = () => {
  const [value, setValue] = useState("// Write your code here");

  const { view, ref } = useEditor<HTMLDivElement>([
    editorOnChange((value) => setValue(value)),
  ]);

  useEffect(() => {
    if (!view) return;

    const currentValue = view.state.doc.toString();

    if (value === currentValue) return;

    view.dispatch({
      changes: {
        from: 0,
        to: currentValue.length,
        insert: value,
      },
    });
  }, [view, value]);

  return <div className={styles.editorWrapper} ref={ref} />;
};
