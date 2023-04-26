import { parser } from "./gen/gdl";
import { styleTags, tags as t } from "@lezer/highlight";
import { LRLanguage, LanguageSupport } from "@codemirror/language";

/** Extends generated parser with some metadata used for highlighting. */
const GDLParser = parser.configure({
  props: [
    styleTags({
      Vertex: t.keyword,
      Edge: t.keyword,
      Id: t.string,
      Value: t.number,
      LineComment: t.lineComment,
    }),
  ],
});

/** GDL language extension for code mirror. */
const GDLLanguage = LRLanguage.define({
  parser: GDLParser,
});

export const GDL = () => new LanguageSupport(GDLLanguage);
