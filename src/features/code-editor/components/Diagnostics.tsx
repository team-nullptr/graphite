import { ParseError } from "../../../engine/gdl/graph-parser";
import { Tab } from "../../../shared/Tab";
import { ErrorDescription } from "./ErrorDescription";

type DiagnosticsSummaryProps = {
  errors: ParseError[];
};

export const DiagnosticsSummary = (props: DiagnosticsSummaryProps) => {
  return (
    <Tab label="Diagnostics">
      <div className="h-full bg-base-200 p-4 text-text-base dark:bg-base-300-dark dark:text-text-base-dark">
        {props.errors.map((error, i) => (
          <ErrorDescription key={i} error={error} />
        ))}
      </div>
    </Tab>
  );
};
