import { useEffect, useState } from "react";
import { Evaluator } from "~/core/adot/evaluator";
import { Lexer } from "~/core/adot/lexer";
import { Parser } from "~/core/adot/parser";
import { Split } from "~/shared/layout/Split";
import { useEditorStore } from "../../pages/editor/context/editor";
import { DiagnosticsSummary } from "./components/Diagnostics";
import "./editor-styles.css";
import { editorOnChange, useEditor } from "./hooks/useEditor";

export function CodeEditor() {
  const { mode, setGraph } = useEditorStore(({ mode, setGraph }) => ({ mode, setGraph }));
  const [code, setCode] = useEditorStore((store) => [store.code, store.setCode]);
  const [errors, setErrors] = useState<Array<string>>([]);

  const isEditorReadonly = mode.type === "SIMULATION";

  const { view, ref } = useEditor<HTMLDivElement>(
    [editorOnChange((value) => setCode(value))],
    isEditorReadonly
  );

  // TODO: It might be a good idea to extract code-mirrors specific logic.
  useEffect(() => {
    if (!view) {
      return;
    }

    const currentValue = view.state.doc.toString();

    if (code === currentValue) {
      return;
    }

    view.dispatch({
      changes: {
        from: 0,
        to: currentValue.length,
        insert: code,
      },
    });
  }, [view, code]);

  useEffect(() => {
    // Do we want to parse graph here?
    const lexer = new Lexer(code);
    const parser = new Parser(lexer);

    setErrors([]);
    const definition = parser.parse();
    setErrors(parser.errors);

    const graph = new Evaluator(definition).eval();
    if (graph.length !== 0) {
      setGraph(graph[0]);
    }
  }, [setGraph, code]);

  const editorClassName = isEditorReadonly ? "h-full opacity-75 grayscale" : "h-full";

  return (
    <Split
      initialShare={75}
      orientation="horizontal"
      first={<div className={editorClassName} ref={ref} />}
      second={<DiagnosticsSummary errors={errors} />}
    />
  );
}
