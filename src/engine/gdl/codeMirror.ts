import { LRLanguage, LanguageSupport } from "@codemirror/language";
import { styleTags, tags } from "@lezer/highlight";
import { parser } from "./gen/gdl";
import { Diagnostic, linter } from "@codemirror/lint";
import { GraphParser, ParseError } from "./graphParser";

export const gdlParser = parser.configure({
  props: [
    styleTags({
      Vertex: tags.keyword,
      DirectedEdge: tags.keyword,
      WeightedDirectedEdge: tags.keyword,
      Edge: tags.keyword,
      WeightedEdge: tags.keyword,
      Id: tags.string,
      Value: tags.number,
      LineComment: tags.lineComment,
    }),
  ],
});

export const gdl = new LanguageSupport(
  LRLanguage.define({
    parser: gdlParser,
  })
);

export const gdlLinter = linter((view): Diagnostic[] => {
  const parser = new GraphParser(view.state.doc.toString());

  try {
    parser.parse();
  } catch (err) {
    if (err instanceof ParseError) {
      return [
        {
          from: err.node.from,
          to: err.node.to,
          severity: "error",
          message: err.message,
        },
      ];
    }
  }

  return [];
});
