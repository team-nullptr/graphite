import { defaultKeymap, history } from "@codemirror/commands";
import { HighlightStyle, syntaxHighlighting } from "@codemirror/language";
import { EditorState, Extension } from "@codemirror/state";
import { EditorView, ViewUpdate, keymap, lineNumbers } from "@codemirror/view";
import { tags } from "@lezer/highlight";
import { useEffect, useRef, useState } from "react";
import { gdl, gdlLinter } from "../../../engine/gdl/code-mirror";

// Creates onChange extension for editor.
export const editorOnChange = (cb: (value: string) => void) => {
  return EditorView.updateListener.of((it: ViewUpdate) => {
    if (!it.docChanged) return;
    const value = it.state.doc.toString();
    cb(value);
  });
};

const GDLHighlightStyle = HighlightStyle.define([
  {
    tag: tags.keyword,
    color: "#4ea5ff",
  },
  {
    tag: tags.string,
    color: "#207bff",
  },
  {
    tag: tags.comment,
    color: "#6A6A71",
  },
  {
    tag: tags.number,
    color: "#F1A26F",
  },
]);

export const useEditor = <T extends HTMLElement>(extensions: Extension[]) => {
  const ref = useRef<T>(null);
  const [view, setView] = useState<EditorView>();

  useEffect(() => {
    if (!ref.current) return;

    const view = new EditorView({
      state: EditorState.create({
        extensions: [
          gdl,
          gdlLinter,
          syntaxHighlighting(GDLHighlightStyle, { fallback: true }),
          history(),
          keymap.of(defaultKeymap),
          lineNumbers(),
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
  }, [ref]);

  return { view, ref };
};
