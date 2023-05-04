import { useEffect, useState } from "react";
import styles from "./CodeEdtor.module.css";
import "./editor-styles.css";
import { editorOnChange, useEditor } from "./hooks/useEditor";
import { useProjectStore } from "../../store/project";
import { GraphParser } from "../../engine/gdl/graph-parser";

export const CodeEditor = () => {
  const setGraph = useProjectStore((state) => state.setGraph);

  const [value, setValue] = useState("// Write your code here");
  const onChange = editorOnChange((value) => setValue(value));
  const { view, ref } = useEditor<HTMLDivElement>([onChange]);

  const [error, setError] = useState("");

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

  useEffect(() => {
    /* 
    TODO: Do we want to parse graph here?
    Or allow parent to pass a callback function that will run on editor value change. 
    */
    try {
      const parser = new GraphParser(value);
      setGraph(parser.parse());
      setError("");
    } catch (err) {
      if (err instanceof Error) setError(err.message);
      else setError("Unexpected error.");
    }
  }, [value]);

  return (
    <div className={styles.editorWrapper}>
      <div className={styles.editor} ref={ref} />
      <div
        className={`${
          error ? styles.editorDiagnosticsError : styles.editorDiagnosticsOk
        } ${styles.editorDiagnostics}`}
      >
        {error ? error : "There are no errors!"}
      </div>
    </div>
  );
};
