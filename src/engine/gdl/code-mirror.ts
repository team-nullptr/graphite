import { LRLanguage, LanguageSupport } from "@codemirror/language";
import { styleTags, tags } from "@lezer/highlight";
import { parser } from "./gen/gdl";

/** Extends generated parser with some metadata used for highlighting. */
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

/** Gdl language support for codemirror editor. */
export const gdl = new LanguageSupport(
  LRLanguage.define({
    parser: gdlParser,
  })
);
