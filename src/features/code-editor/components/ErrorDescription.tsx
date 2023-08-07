export type ErrorDescriptionProps = {
  error: Error;
};

export function ErrorDescription({ error }: ErrorDescriptionProps) {
  return (
    <div className="border-l-4 border-red-500 px-4 py-2">
      <div className="text-slatee-800">{error.message}</div>
    </div>
  );
}
