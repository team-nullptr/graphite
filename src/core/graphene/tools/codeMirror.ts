import { LRLanguage, LanguageSupport } from "@codemirror/language";
import { styleTags, tags } from "@lezer/highlight";
import { parser } from "./gen/gdl";

export const grapheneParser = parser.configure({
  props: [
    styleTags({
      Identifier: tags.keyword,
      Vertex: tags.variableName,
      Number: tags.number,
      "( ) [ ]": tags.paren,
      ",": tags.punctuation,
    }),
  ],
});

export const graphene = new LanguageSupport(
  LRLanguage.define({
    parser: grapheneParser,
  })
);
