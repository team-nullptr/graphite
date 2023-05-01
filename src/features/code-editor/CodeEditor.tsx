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
    if (!view) return;

    try {
      const parser = new GraphParser(view.state);
      setGraph(parser.parse());
    } catch (err) {
      console.error(err);
    }
  }, [value]);

  return <div className={styles.editorWrapper} ref={ref} />;
};
