import { useEffect, useState } from "react";
import { GraphParser, ParseError } from "../../engine/gdl/graph-parser";
import { useProjectStore } from "../../store/project";
import "./editor-styles.css";
import { editorOnChange, useEditor } from "./hooks/useEditor";
import { HorizontalSplit } from "../../shared/HorizontalSplit";
import { DiagnosticsSummary } from "./components/Diagnostics";

export const CodeEditor = () => {
  const [value, setValue] = useState("// Write your code here");
  const [errors, setErrors] = useState<ParseError[]>([]);

  const setGraph = useProjectStore((state) => state.setGraph);

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

  useEffect(() => {
    /*
    TODO: Do we want to parse graph here?
    Or allow parent to pass a callback function that will run on editor value change.
    */

    const parser = new GraphParser(value);

    try {
      const graph = parser.parse();
      setGraph(graph);
    } catch (err) {
      if (err instanceof ParseError) setErrors([err]);
      else console.error("Unexpected error");
    }
  }, [value]);

  return (
    <HorizontalSplit
      top={<div ref={ref} />}
      bottom={<DiagnosticsSummary errors={errors} />}
    />
  );
};
