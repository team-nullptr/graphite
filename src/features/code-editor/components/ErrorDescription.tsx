import { ParseError } from "../../../engine/gdl/graph-parser";

export type ErrorDescriptionProps = {
  error: ParseError;
};

export const ErrorDescription = (props: ErrorDescriptionProps) => {
  const { line, message } = props.error;

  return (
    <div className="border-l-4 border-diagnostic-error px-4 py-2">
      <div className="text-sm text-text-dimmed dark:text-text-dimmed-dark">
        At line {line}
      </div>
      <div className="text-text-base dark:text-text-base-dark">{message}</div>
    </div>
  );
};
