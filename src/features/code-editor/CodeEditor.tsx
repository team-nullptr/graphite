import { useEffect, useRef, useState } from "react";
import styles from "./CodeEdtor.module.css";
import "./editor-styles.css";
import { editorOnChange, useEditor } from "./hooks/useEditor";

export const CodeEditor = () => {
  const [value, setValue] = useState("// Declare your graph here");

  const { editor, ref } = useEditor<HTMLDivElement>([
    editorOnChange((value) => setValue(value)),
  ]);

  useEffect(() => {
    if (!editor) return;

    const currentValue = editor.state.doc.toString();

    if (value === currentValue) return;

    editor.dispatch({
      changes: {
        from: 0,
        to: currentValue.length,
        insert: value,
      },
    });
  }, [editor, value]);

  return <div className={styles.editorWrapper} ref={ref} />;
};
