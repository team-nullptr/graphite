import {
  InitialConfigType,
  LexicalComposer,
} from "@lexical/react/LexicalComposer";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import LexicalErrorBoundary from "@lexical/react/LexicalErrorBoundary";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { PlainTextPlugin } from "@lexical/react/LexicalPlainTextPlugin";
import { TextNode } from "lexical";
import { useEffect } from "react";
import styles from "./GraphEditor.module.css";

const theme = new Map<string, string>([
  ["vertex", "F09552"],
  ["edge", "6EB2D0"],
]);

const GDLHighlightPlugin = () => {
  const [editor] = useLexicalComposerContext();

  useEffect(
    () =>
      editor.registerNodeTransform(TextNode, (node) => {
        const nodeContent = node.getTextContent();

        if (!theme.has(nodeContent)) {
          return;
        }

        const style = `color: #${theme.get(node.getTextContent())}`;

        if (node.getStyle() === style) {
          return;
        }

        node.setStyle(style);
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
        <HistoryPlugin />
        <PlainTextPlugin
          contentEditable={<ContentEditable className={styles.editorInput} />}
          placeholder={null}
          ErrorBoundary={LexicalErrorBoundary}
        />
        <GDLHighlightPlugin />
      </div>
    </LexicalComposer>
  );
};
