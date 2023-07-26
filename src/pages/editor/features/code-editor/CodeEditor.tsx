import { useEffect, useState } from "react";
import { Interpreter } from "~/core/graphene/interpreter";
import { Lexer } from "~/core/graphene/lexer";
import { Parser } from "~/core/graphene/parser";
import { HorizontalSplit } from "~/shared/layout/HorizontalSplit";
import { useEditorStore } from "../../context/editor";
import { DiagnosticsSummary } from "./components/Diagnostics";
import "./editor-styles.css";
import { editorOnChange, useEditor } from "./hooks/useEditor";

const initialEditorValue = `# Check out detailed graphene guide at
# https://github.com/team-nullptr/graphite/tree/dev/src/core/graphene

# Create vertex or many vertices
vertex(A)
vertex([B, C, D, E, F, G, H, I])

# Pass optional vertex's value after it's id
# (default value is 1)
vertex(J, 4)
vertex([K, L], 2)

# Create edges between two vertices
edge(D, I)
edge(B, F)
edge(E, C)
edge(A, H)
edge(D, B, 10)
# Or create edge from one vertex to many other vertices
edge(A, [B, C, D], 2)

# Create directed edges
arc(E, I)
arc(I, G)
arc(G, F)
arc(F, H)
edge(J, L)
edge(L, K)
edge(K, J)
arc(I, L, 10)
`;

export const CodeEditor = () => {
  const setGraph = useEditorStore(({ setGraph }) => setGraph);
  const [value, setValue] = useState(initialEditorValue);
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

      setGraph(graph);
      setErrors([]);
    } catch (err) {
      if (err instanceof Error) setErrors([err]);
      else console.error("Unexpected error");
    }
  }, [setGraph, value]);

  return (
    <HorizontalSplit
      top={<div className="h-full" ref={ref} />}
      bottom={<DiagnosticsSummary errors={errors} />}
    />
  );
};
