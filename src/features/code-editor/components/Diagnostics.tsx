import { BugAntIcon } from "@heroicons/react/24/outline";
import { ParseError } from "../../../engine/gdl/graphParser";
import { Tab } from "../../../shared/Tab";
import { ErrorDescription } from "./ErrorDescription";

type DiagnosticsSummaryProps = {
  errors: ParseError[];
};

export const DiagnosticsSummary = ({ errors }: DiagnosticsSummaryProps) => {
  return (
    <Tab label="Diagnostics" icon={<BugAntIcon className="h-4 w-4" />}>
      <div className="h-full bg-base-200 p-4 text-text-base dark:bg-base-300-dark dark:text-text-base-dark">
        {errors.map((error, i) => (
          <ErrorDescription key={i} error={error} />
        ))}
      </div>
    </Tab>
  );
};
