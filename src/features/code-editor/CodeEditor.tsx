import { useEffect, useState } from "react";
import { GraphParser } from "../../engine/gdl/graph-parser";
import { useProjectStore } from "../../store/project";
import "./editor-styles.css";
import { editorOnChange, useEditor } from "./hooks/useEditor";

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
    <div className="w-full border-b border-base-300">
      <div className="border-b border-base-300" ref={ref} />
      <div
        className={`${
          error ? "text-diagnostic-error" : "text-diagnostic-ok"
        } p-3`}
      >
        {error ? error : "There are no errors!"}
      </div>
    </div>
  );
};
