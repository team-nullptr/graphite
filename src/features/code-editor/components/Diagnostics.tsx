import { Tab } from "~/shared/Tab";
import { ErrorDescription } from "./ErrorDescription";

type DiagnosticsSummaryProps = {
  errors: Error[];
};

export const DiagnosticsSummary = ({ errors }: DiagnosticsSummaryProps) => {
  return (
    <Tab label="Diagnostics">
      <div className="h-full bg-slate-50 p-4 text-slate-900">
        {errors.length === 0 && (
          <p className="text-center text-sm text-slate-500">
            You will see any errors in your graph definition here. For now you
            are good to go!
          </p>
        )}
        {errors.map((error, i) => (
          <ErrorDescription key={i} error={error} />
        ))}
      </div>
    </Tab>
  );
};
