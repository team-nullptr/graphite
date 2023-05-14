import { Diagnostic, linter } from "@codemirror/lint";
import { GraphParser, ParseError } from "./graph-parser";

/* Basic linter that reports errors returned by GraphParser. */
export const gdlLinter = linter((view): Diagnostic[] => {
  const parser = new GraphParser(view.state.doc.toString());

  try {
    parser.parse();
  } catch (err) {
    if (err instanceof ParseError) {
      return [
        {
          from: err.precedingNode.from,
          to: err.precedingNode.to,
          severity: "error",
          message: err.message,
        },
      ];
    }
  }

  return [];
});
