export type ErrorDescriptionProps = {
  error: Error;
};

export const ErrorDescription = (props: ErrorDescriptionProps) => {
  const { message } = props.error;

  return (
    <div className="border-l-4 border-red-500 px-4 py-2">
      <div className="text-slatee-800">{message}</div>
    </div>
  );
};
