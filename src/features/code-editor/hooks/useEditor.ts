import { defaultKeymap, history } from "@codemirror/commands";
import { HighlightStyle, syntaxHighlighting } from "@codemirror/language";
import { Compartment, EditorState, Extension } from "@codemirror/state";
import { EditorView, ViewUpdate, keymap, lineNumbers } from "@codemirror/view";
import { tags } from "@lezer/highlight";
import { useEffect, useRef, useState } from "react";
import { gdl } from "../../../engine/gdl/code-mirror";
import { gdlLinter } from "../../../engine/gdl/gdl-linter";
import { Theme, useTheme } from "../../../context/theme";

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

// TODO: Make those themes pretty.
const darkTheme = EditorView.theme(
  {
    "&": {
      color: "black",
      backgroundColor: "#1E1F23",
      height: "100%",
    },
  },
  { dark: true }
);

const lightTheme = EditorView.theme({});

export const useEditor = <T extends HTMLElement>(extensions: Extension[]) => {
  const ref = useRef<T>(null);
  const [view, setView] = useState<EditorView>();

  const { theme } = useTheme();
  const themeConfig = useRef(new Compartment());

  const editorThemes: Record<Theme, Extension> = {
    dark: darkTheme,
    light: lightTheme,
  };

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
          themeConfig.current.of([darkTheme]),
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

  useEffect(() => {
    // If the view is not initialized or valid theme is used do not change anything.
    if (!view || themeConfig.current.get(view.state) === editorThemes[theme])
      return;

    view.dispatch({
      effects: themeConfig.current.reconfigure(editorThemes[theme]),
    });
  }, [theme, view]);

  return { view, ref };
};
