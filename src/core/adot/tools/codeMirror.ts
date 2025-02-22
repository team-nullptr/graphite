import { LRLanguage, LanguageSupport } from "@codemirror/language";
import { styleTags, tags } from "@lezer/highlight";
import { parser } from "./gen/gdl";

export const adotThemeParser = parser.configure({
  props: [
    styleTags({
      Number: tags.number,
      Comment: tags.comment,
      "[ ] { }": tags.bracket,
    }),
  ],
});

export const adot = new LanguageSupport(
  LRLanguage.define({
    parser: adotThemeParser,
  })
);
