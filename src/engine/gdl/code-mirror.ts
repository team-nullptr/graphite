import { LRLanguage, LanguageSupport, syntaxTree } from "@codemirror/language";
import { Diagnostic, linter } from "@codemirror/lint";
import { styleTags, tags } from "@lezer/highlight";
import { parser } from "./gen/gdl";

/** Extends generated parser with some metadata used for highlighting. */
export const gdlParser = parser.configure({
  props: [
    styleTags({
      Vertex: tags.keyword,
      Edge: tags.keyword,
      Id: tags.string,
      Value: tags.number,
      LineComment: tags.lineComment,
    }),
  ],
});

/**
 * Very basic linter that just informs user about a syntax error somewhere in his definition.
 * It is harder to get something better than this using an LR parser.
 */
export const gdlLinter = linter((view): Diagnostic[] => {
  const state = view.state;
  const tree = syntaxTree(state);

  // We don't want to process partial parses.
  // https://discuss.codemirror.net/t/show-syntax-error-from-lezer-parse/5346
  if (tree.length !== state.doc.length) {
    return [];
  }

  let diagnostic: Diagnostic | undefined;

  tree.cursor().iterate((n) => {
    if (!diagnostic && n.type.isError) {
      diagnostic = {
        from: n.node.from,
        to: n.node.to,
        severity: "error",
        message: "Syntax error.",
      };
    }
  });

  return diagnostic ? [diagnostic] : [];
});

/** Gdl language support for codemirror editor. */
export const gdl = new LanguageSupport(
  LRLanguage.define({
    parser: gdlParser,
  })
);
