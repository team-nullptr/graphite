export type ErrorDescriptionProps = {
  error: string;
};

export function ErrorDescription({ error }: ErrorDescriptionProps) {
  return (
    <div className="border-l-4 border-red-500 bg-red-100 px-4 py-2">
      <div className="text-slatee-800">
        <pre>{error}</pre>
      </div>
    </div>
  );
}
