import {
  LexicalComposer,
  InitialConfigType,
} from "@lexical/react/LexicalComposer";
import { PlainTextPlugin } from "@lexical/react/LexicalPlainTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import LexicalErrorBoundary from "@lexical/react/LexicalErrorBoundary";
import styles from "./GraphEditor.module.css";
import { TextNode } from "lexical";
import { useEffect } from "react";

const theme = new Map<string, string>([
  ["vertex", "F09552"],
  ["edge", "6EB2D0"],
]);

const GDLHighlightPlugin = () => {
  const [editor] = useLexicalComposerContext();

  useEffect(
    () =>
      editor.registerNodeTransform(TextNode, (node) => {
        console.log(node.getTextContent());

        if (theme.has(node.getTextContent())) {
          console.log("COLORING", theme.get(node.getTextContent()));
          node.__style = `color: #${theme.get(node.getTextContent())}`;
        } else {
          node.__style = `color: #000000`;
        }
      }),
    [editor]
  );

  return null;
};

const editorConfig: InitialConfigType = {
  namespace: "GraphEditor",
  onError: (e) => console.error(e),
};

export const GraphEditor = () => {
  return (
    <LexicalComposer initialConfig={editorConfig}>
      <div className={styles.editor}>
        <GDLHighlightPlugin />
        <HistoryPlugin />
        <PlainTextPlugin
          contentEditable={<ContentEditable className={styles.editorInput} />}
          placeholder={null}
          ErrorBoundary={LexicalErrorBoundary}
        />
      </div>
    </LexicalComposer>
  );
};
