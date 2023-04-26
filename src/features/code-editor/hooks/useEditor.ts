import { defaultKeymap } from "@codemirror/commands";
import { HighlightStyle, syntaxHighlighting } from "@codemirror/language";
import { EditorState, Extension } from "@codemirror/state";
import { EditorView, ViewUpdate, keymap } from "@codemirror/view";
import { tags } from "@lezer/highlight";
import { useEffect, useRef, useState } from "react";
import { GDL } from "../../../engine/gdl/code-mirror";

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
    color: "#F09552",
  },
  {
    tag: tags.string,
    color: "#90b735",
  },
  {
    tag: tags.comment,
    color: "#6A6A71",
  },
]);

export const useEditor = <T extends HTMLElement>(extensions: Extension[]) => {
  const ref = useRef<T>(null);
  const [editor, setEditor] = useState<EditorView>();

  useEffect(() => {
    if (!ref.current) return;

    const view = new EditorView({
      state: EditorState.create({
        extensions: [
          GDL(),
          syntaxHighlighting(GDLHighlightStyle, { fallback: true }),
          keymap.of(defaultKeymap),
          ...extensions,
        ],
      }),
      parent: ref.current,
    });

    setEditor(view);

    return () => {
      view.destroy();
      setEditor(undefined);
    };
  }, [ref]);

  return { editor, ref };
};
