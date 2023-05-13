import { useEffect, useState } from "react";
import { GraphParser } from "../../engine/gdl/graph-parser";
import { useProjectStore } from "../../store/project";
import "./editor-styles.css";
import { editorOnChange, useEditor } from "./hooks/useEditor";
import { HorizontalSplit } from "../../shared/HorizontalSplit";
import { Tab } from "../../shared/Tab";

export const CodeEditor = () => {
  const [value, setValue] = useState("// Write your code here");
  const [error, setError] = useState("");

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
    <HorizontalSplit top={<div ref={ref} />} bottom={<DiagnosticsSummary />} />
  );
};

const DiagnosticsSummary = () => {
  return (
    <Tab label="Diagnostics">
      <div className="h-full bg-base-200 p-4 text-text-base dark:bg-base-300-dark dark:text-text-base-dark">
        This is mock diagnostics summary tab This is mock diagnostics summary
        tab This is mock diagnostics summary tab This is mock diagnostics
        summary tab This is mock diagnostics summary tab This is mock
        diagnostics summary tab This is mock diagnostics summary tab This is
        mock diagnostics summary tab This is mock diagnostics summary tab This
        is mock diagnostics summary tab This is mock diagnostics summary tab
        This is mock diagnostics summary tab
      </div>
    </Tab>
  );
};
