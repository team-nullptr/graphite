import styles from "./CodeEdtor.module.css";
import { defaultKeymap } from "@codemirror/commands";
import { HighlightStyle, syntaxHighlighting } from "@codemirror/language";
import { EditorState } from "@codemirror/state";
import { EditorView, keymap } from "@codemirror/view";
import { tags } from "@lezer/highlight";
import { useEffect, useRef } from "react";
import { GDL } from "../../engine/gdl/code-mirror";
import "./editor-styles.css";

const GDLHighlightStyle = HighlightStyle.define([
  {
    tag: tags.keyword,
    // color: "#75C0F9",
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

const GDLEditorInitialState = EditorState.create({
  doc: "// Define your graph here",
  extensions: [
    GDL(),
    keymap.of(defaultKeymap),
    syntaxHighlighting(GDLHighlightStyle, { fallback: true }),
    // lineNumbers(), // TODO: Do we want to have line numbers?
  ],
});

/** GDL code editor. */
export const CodeEditor = () => {
  const editorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!editorRef.current) return;

    const view = new EditorView({
      state: GDLEditorInitialState,
      parent: editorRef.current,
    });

    return () => view.destroy();
  }, [editorRef]);

  return <div className={styles.editorWrapper} ref={editorRef}></div>;
};
