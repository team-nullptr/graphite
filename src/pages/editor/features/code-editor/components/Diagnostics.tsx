import { Tab } from "~/shared/Tab";
import { ErrorDescription } from "./ErrorDescription";

type DiagnosticsSummaryProps = {
  errors: Error[];
};

export const DiagnosticsSummary = ({ errors }: DiagnosticsSummaryProps) => {
  return (
    <Tab label="Diagnostics">
      <div className="h-full bg-slate-50 p-4 text-slate-900">
        {errors.map((error, i) => (
          <ErrorDescription key={i} error={error} />
        ))}
      </div>
    </Tab>
  );
};
