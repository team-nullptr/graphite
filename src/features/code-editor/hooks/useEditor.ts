import { defaultKeymap, indentWithTab, history } from "@codemirror/commands";
import { HighlightStyle, syntaxHighlighting } from "@codemirror/language";
import { Compartment, EditorState, Extension } from "@codemirror/state";
import { EditorView, ViewUpdate, keymap, lineNumbers } from "@codemirror/view";
import { tags } from "@lezer/highlight";
import { useEffect, useRef, useState } from "react";
import colors from "tailwindcss/colors";
import { startCompletion, closeBrackets } from "@codemirror/autocomplete";
import { adot } from "~/core/adot/tools/codeMirror";

// Creates onChange extension for editor.
export function editorOnChange(cb: (value: string) => void) {
  return EditorView.updateListener.of((it: ViewUpdate) => {
    if (!it.docChanged) return;
    const value = it.state.doc.toString();
    cb(value);
  });
}

export function editorReadonlyExtension(readonly: boolean): Extension {
  return [EditorView.editable.of(!readonly), EditorState.readOnly.of(readonly)];
}

const codeThemeLight = HighlightStyle.define([
  {
    tag: [tags.content],
    color: colors.slate[400],
  },
  {
    tag: [tags.comment],
    color: colors.slate[400],
  },
  {
    tag: [tags.bracket],
    color: colors.slate[900],
  },
  {
    tag: [tags.number],
    color: colors.sky[600],
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

export function useEditor<T extends HTMLElement>(extensions: Extension[], readonly: boolean) {
  const ref = useRef<T>(null);
  const [view, setView] = useState<EditorView>();

  const editorThemeCompartment = useRef(new Compartment());

  useEffect(() => {
    if (!ref.current) return;

    const view = new EditorView({
      state: EditorState.create({
        extensions: [
          adot,
          keymap.of([{ key: "Ctrl-`", run: startCompletion }]),
          keymap.of([...defaultKeymap, indentWithTab]),
          editorThemeCompartment.current.of([
            editorThemeLight,
            syntaxHighlighting(codeThemeLight, { fallback: true }),
          ]),
          history(),
          lineNumbers(),
          closeBrackets(),
          editorReadonlyExtension(readonly),
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
}
