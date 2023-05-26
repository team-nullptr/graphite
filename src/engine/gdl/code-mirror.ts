import { LRLanguage, LanguageSupport } from "@codemirror/language";
import { styleTags, tags } from "@lezer/highlight";
import { parser } from "./gen/gdl";

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
