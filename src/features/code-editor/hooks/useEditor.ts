import { defaultKeymap, history } from "@codemirror/commands";
import { HighlightStyle, syntaxHighlighting } from "@codemirror/language";
import { Compartment, EditorState, Extension } from "@codemirror/state";
import { EditorView, ViewUpdate, keymap, lineNumbers } from "@codemirror/view";
import { tags } from "@lezer/highlight";
import { useEffect, useRef, useState } from "react";
import { graphene } from "~/core/graphene/tools/codeMirror";
import colors from "tailwindcss/colors";

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
    tag: [tags.variableName, tags.keyword],
    color: colors.slate[700],
  },
  {
    tag: [tags.variableName],
    color: colors.sky[500],
  },
  {
    tag: tags.number,
    color: colors.blue[500],
  },
  {
    tag: [tags.paren, tags.punctuation],
    color: colors.slate[700],
  },
  {
    tag: [tags.comment],
    color: colors.slate[400],
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

export function useEditor<T extends HTMLElement>(extensions: Extension[], readonly: boolean) {
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
