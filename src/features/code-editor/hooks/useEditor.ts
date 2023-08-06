import { defaultKeymap, history } from "@codemirror/commands";
import { HighlightStyle, syntaxHighlighting } from "@codemirror/language";
import { Compartment, EditorState, Extension } from "@codemirror/state";
import { EditorView, ViewUpdate, keymap, lineNumbers } from "@codemirror/view";
import { tags } from "@lezer/highlight";
import { useEffect, useRef, useState } from "react";
import { graphene } from "~/core/graphene/tools/codeMirror";

// Creates onChange extension for editor.
export const editorOnChange = (cb: (value: string) => void) => {
  return EditorView.updateListener.of((it: ViewUpdate) => {
    if (!it.docChanged) return;
    const value = it.state.doc.toString();
    cb(value);
  });
};

const codeThemeLight = HighlightStyle.define([
  {
    tag: [tags.variableName, tags.keyword],
    color: "#60a5fa",
  },
  {
    tag: tags.number,
    color: "#f59e0b",
  },
  {
    tag: [tags.paren, tags.punctuation],
    color: "#475569",
  },
  {
    tag: [tags.comment],
    color: "#c0c9d3",
    fontStyle: "italic",
    fontWeight: 300,
  },
]);

const editorThemeLight = EditorView.theme({
  "&": {
    backgroundColor: "#f9fafb",
    height: "100%",
  },
  ".cm-gutters": {
    border: "none",
    backgroundColor: "#f9fafb",
  },
});

export const useEditor = <T extends HTMLElement>(extensions: Extension[]) => {
  const ref = useRef<T>(null);
  const [view, setView] = useState<EditorView>();

  const editorThemeCompartment = useRef(new Compartment());

  useEffect(() => {
    if (!ref.current) return;

    const view = new EditorView({
      state: EditorState.create({
        extensions: [
          graphene,
          history(),
          keymap.of(defaultKeymap),
          lineNumbers(),
          editorThemeCompartment.current.of([
            editorThemeLight,
            syntaxHighlighting(codeThemeLight, { fallback: true }),
          ]),
          ...extensions,
        ],
      }),
      parent: ref.current,
    });

    setView(view);

    return () => {
      view.destroy();
      setView(undefined);
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ref]);

  return { view, ref };
};
