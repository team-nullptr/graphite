import { useEffect, useState } from "react";
import { GraphParser, ParseError } from "../../engine/gdl/graph-parser";
import "./editor-styles.css";
import { editorOnChange, useEditor } from "./hooks/useEditor";
import { HorizontalSplit } from "../../shared/layout/HorizontalSplit";
import { DiagnosticsSummary } from "./components/Diagnostics";
import { useEditorStore } from "../editor/context/editor";

export const CodeEditor = () => {
  const replaceGraph = useEditorStore((state) => state.replaceGraph);
  const [value, setValue] = useState("// Write your code here");
  const [errors, setErrors] = useState<ParseError[]>([]);

  const { view, ref } = useEditor<HTMLDivElement>([
    editorOnChange((value) => setValue(value)),
  ]);

  // TODO: It might be a good idea to extract code-mirrors specific logic.
  useEffect(() => {
    if (!view) {
      return;
    }

    const currentValue = view.state.doc.toString();

    if (value === currentValue) {
      return;
    }

    view.dispatch({
      changes: {
        from: 0,
        to: currentValue.length,
        insert: value,
      },
    });
  }, [view, value]);

  useEffect(() => {
    // Do we want to parse graph here?
    const parser = new GraphParser(value);

    try {
      const graph = parser.parse();
      replaceGraph(graph);
      console.log(graph);
      setErrors([]);
    } catch (err) {
      if (err instanceof ParseError) setErrors([err]);
      else console.error("Unexpected error");
    }
  }, [replaceGraph, value]);

  return (
    <HorizontalSplit
      top={<div className="h-full" ref={ref} />}
      bottom={<DiagnosticsSummary errors={errors} />}
    />
  );
};
