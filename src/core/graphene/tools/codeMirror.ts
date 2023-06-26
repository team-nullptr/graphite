import { LRLanguage, LanguageSupport } from "@codemirror/language";
import { styleTags, tags } from "@lezer/highlight";
import { parser } from "./gen/gdl";

export const grapheneParser = parser.configure({
  props: [
    // TODO: Work out how to make this styletags work properly
    styleTags({
      Identifier: tags.variableName,
      Number: tags.number,
    }),
  ],
});

export const graphene = new LanguageSupport(
  LRLanguage.define({
    parser: grapheneParser,
  })
);
