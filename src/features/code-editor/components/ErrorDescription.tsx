export type ErrorDescriptionProps = {
  error: Error;
};

export const ErrorDescription = (props: ErrorDescriptionProps) => {
  const { message } = props.error;

  return (
    <div className="border-l-4 border-diagnostic-error px-4 py-2">
      <div className="text-text-base dark:text-text-base-dark">{message}</div>
    </div>
  );
};
