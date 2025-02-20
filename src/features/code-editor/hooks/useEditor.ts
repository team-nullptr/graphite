import { defaultKeymap, indentWithTab, history } from "@codemirror/commands";
import { HighlightStyle, syntaxHighlighting, syntaxTree } from "@codemirror/language";
import { Compartment, EditorState, Extension } from "@codemirror/state";
import { EditorView, ViewUpdate, keymap, lineNumbers } from "@codemirror/view";
import { tags } from "@lezer/highlight";
import { useEffect, useRef, useState } from "react";
import colors from "tailwindcss/colors";
import {
  CompletionContext,
  autocompletion,
  startCompletion,
  closeBrackets,
} from "@codemirror/autocomplete";

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
    color: colors.slate[900],
  },
  {
    tag: [tags.variableName],
    color: colors.sky[500],
  },
  {
    tag: tags.number,
    color: colors.sky[700],
  },
  {
    tag: [tags.paren, tags.punctuation],
    color: colors.slate[600],
  },
  {
    tag: [tags.comment],
    color: colors.slate[400],
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
          keymap.of([{ key: "Ctrl-`", run: startCompletion }]),
          history(),
          keymap.of([...defaultKeymap, indentWithTab]),
          lineNumbers(),
          closeBrackets(),
          autocompletion({
            override: [
              function (context: CompletionContext) {
                const word = context.matchBefore(/\w*/);
                if (word?.from == word?.to && !context.explicit) return null;

                const nodeBefore = syntaxTree(context.state).resolveInner(context.pos, -1);
                const textBefore = context.state.sliceDoc(nodeBefore.from, context.pos);
                const tagBefore = /\w*$/.exec(textBefore);

                return {
                  from: tagBefore ? nodeBefore.from + tagBefore.index : context.pos,
                  options: [
                    { label: "graph", type: "keyword" },
                    { label: "digraph", type: "keyword" },
                  ],
                };
              },
            ],
          }),
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
