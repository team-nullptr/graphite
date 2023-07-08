import { useEffect, useState } from "react";
import "./editor-styles.css";
import { editorOnChange, useEditor } from "./hooks/useEditor";
import { HorizontalSplit } from "../../../../layout/HorizontalSplit";
import { DiagnosticsSummary } from "./components/Diagnostics";
import { useEditorStore } from "../../context/editor";
import { Lexer } from "../../../../core/graphene/lexer";
import { Parser } from "../../../../core/graphene/parser";
import { Interpreter } from "../../../../core/graphene/interpreter";

export const CodeEditor = () => {
  const replaceGraph = useEditorStore((state) => state.replaceGraph);
  const [value, setValue] = useState("");
  const [errors, setErrors] = useState<Error[]>([]);

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
    try {
      const tokens = new Lexer(value).lex();
      const stmts = new Parser(tokens).parse();
      const graph = new Interpreter(stmts).forge();

      replaceGraph(graph);
      setErrors([]);
    } catch (err) {
      if (err instanceof Error) setErrors([err]);
      else console.error("Unexpected error");
    }
  }, [replaceGraph, value]);

  return (
    <HorizontalSplit
      initialTopShare={90}
      top={<div className="h-full" ref={ref} />}
      bottom={<DiagnosticsSummary errors={errors} />}
    />
  );
};
