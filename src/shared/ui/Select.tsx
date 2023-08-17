import { useState } from "react";
import { ChevronDownIcon, ChevronUpIcon, ArrowUpRightIcon } from "@heroicons/react/24/outline";

export type SelectOptions = {
  value?: string;
  onChange: (value: string) => void;
  label: string;
  values: string[];
};

// TODO: Use radix-ui for this
export function Select({ values, label, value, onChange }: SelectOptions) {
  const [opened, setOpened] = useState(false);

  const handleValueChange = (value: string) => {
    onChange(value);
    setOpened(false);
  };

  return (
    <div className="relative w-full">
      <div
        className="relative w-full rounded-md border px-4 py-2"
        onClick={() => setOpened(!opened)}
      >
        {value ? value : <span className="text-slate-500">{label}</span>}
        {opened ? (
          <ChevronDownIcon className="absolute bottom-0 right-2 top-0 my-auto h-4 w-4" />
        ) : (
          <ChevronUpIcon className="absolute bottom-0 right-2 top-0 my-auto h-4 w-4" />
        )}
      </div>
      {opened && (
        <div className="absolute mt-1 max-h-48 w-full overflow-y-auto rounded-md border bg-slate-50">
          {values.length > 0 ? (
            values.map((value) => (
              <div
                className="flex h-10 items-center px-4 py-2 hover:bg-gray-100"
                key={value}
                onClick={() => handleValueChange(value)}
              >
                {value}
              </div>
            ))
          ) : (
            <div className="p-4">
              <p className="text-center text-sm text-slate-500">
                It looks like your graph does not have any vertices! Check out{" "}
                <a
                  className="text-blue-500 underline"
                  href="https://github.com/team-nullptr/graphite"
                >
                  The Graphene Guide
                  <ArrowUpRightIcon className="inline-block h-4 w-4" />
                </a>{" "}
                to learn about making your own graphs.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
