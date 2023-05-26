import { ParseError } from "../../../engine/gdl/graph-parser";
import { Tab } from "../../../shared/Tab";
import { ErrorDescription } from "./ErrorDescription";
import { CheckIcon, XMarkIcon } from "@heroicons/react/20/solid";

type DiagnosticsSummaryProps = {
  errors: ParseError[];
};

export const DiagnosticsSummary = (props: DiagnosticsSummaryProps) => {
  const hasError = props.errors.length > 0;

  return (
    <Tab
      label="Diagnostics"
      icon={
        <span
          className={`flex aspect-square items-center justify-center rounded-sm  p-[0.75px] text-black ${
            hasError ? "bg-diagnostic-error" : "bg-diagnostic-ok"
          }`}
        >
          {hasError ? (
            <XMarkIcon className="h-4 w-4" />
          ) : (
            <CheckIcon className="h-4 w-4" />
          )}
        </span>
      }
    >
      <div className="h-full bg-base-200 p-4 text-text-base dark:bg-base-300-dark dark:text-text-base-dark">
        {props.errors.map((error, i) => (
          <ErrorDescription key={i} error={error} />
        ))}
      </div>
    </Tab>
  );
};
