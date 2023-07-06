import { defaultKeymap, history } from "@codemirror/commands";
import { HighlightStyle, syntaxHighlighting } from "@codemirror/language";
import { Compartment, EditorState, Extension } from "@codemirror/state";
import { EditorView, ViewUpdate, keymap, lineNumbers } from "@codemirror/view";
import { tags } from "@lezer/highlight";
import { useEffect, useMemo, useRef, useState } from "react";
import { graphene } from "../../../core/graphene/tools/codeMirror";
import { Theme, useTheme } from "../../../context/theme";

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
    tag: tags.variableName,
    color: "#6F42C1",
  },
  {
    tag: tags.number,
    color: "#6F42C1",
  },
]);

const codeThemeDark = HighlightStyle.define([
  {
    tag: tags.brace,
    color: "#CAD1D8",
  },
  {
    tag: tags.variableName,
    color: "#D2A8FF",
  },
  {
    tag: tags.number,
    color: "#D2A8FF",
  },
]);

// TODO: Make those themes pretty.
const editorThemeDark = EditorView.theme(
  {
    "&": {
      backgroundColor: "#1E1F23",
      height: "100%",
    },
    ".cm-gutters": {
      backgroundColor: "#1E1F23",
    },
  },
  { dark: true }
);

const editorThemeLight = EditorView.theme({
  "&": {
    backgroundColor: "#ffffff",
    height: "100%",
  },
  ".cm-gutters": {
    border: "none",
    backgroundColor: "#ffffff",
  },
});

export const useEditor = <T extends HTMLElement>(extensions: Extension[]) => {
  const ref = useRef<T>(null);
  const [view, setView] = useState<EditorView>();

  const { theme } = useTheme();
  const editorThemeCompartment = useRef(new Compartment());

  const themes: Record<Theme, Extension[]> = useMemo(
    () => ({
      light: [
        editorThemeLight,
        syntaxHighlighting(codeThemeLight, { fallback: true }),
      ],
      dark: [
        editorThemeDark,
        syntaxHighlighting(codeThemeDark, { fallback: true }),
      ],
    }),
    []
  );

  useEffect(() => {
    if (!ref.current) return;

    const view = new EditorView({
      state: EditorState.create({
        extensions: [
          graphene,
          history(),
          keymap.of(defaultKeymap),
          lineNumbers(),
          editorThemeCompartment.current.of([editorThemeLight]),
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

  useEffect(() => {
    // If the view is not initialized or valid theme is used do not change anything.
    if (!view) return;

    view.dispatch({
      effects: editorThemeCompartment.current.reconfigure(themes[theme]),
    });
  }, [theme, themes, view]);

  return { view, ref };
};
