import { ChevronDownIcon, ChevronUpIcon, ArrowUpRightIcon } from "@heroicons/react/24/outline";

import * as RadixSelect from "@radix-ui/react-select";

export type SelectOptions = {
  value?: string;
  onChange: (value: string) => void;
  label: string;
  values: string[];
};

export type SelectItemOptions = {
  value: string;
};

export function Select({ values, label, value, onChange }: SelectOptions) {
  return (
    <RadixSelect.Root
      onValueChange={(selectedValue) => {
        onChange(selectedValue);
      }}
    >
      <RadixSelect.Trigger
        aria-label="Vertex picker"
        className="relative w-full rounded-md border px-4 py-2 text-left"
      >
        <RadixSelect.Value placeholder="Choose starting vertex" />
        <RadixSelect.Icon className="absolute bottom-0 right-2 top-0 my-auto h-4 w-4">
          <ChevronDownIcon />
        </RadixSelect.Icon>
      </RadixSelect.Trigger>
      <RadixSelect.Portal>
        <RadixSelect.Content>
          <RadixSelect.ScrollDownButton>
            <ChevronUpIcon />
          </RadixSelect.ScrollDownButton>
          <RadixSelect.Viewport>
            {values.map((val) => (
              <SelectItem key={val} value={val} />
            ))}
          </RadixSelect.Viewport>
          <RadixSelect.ScrollDownButton className="text-violet11 flex h-[25px] cursor-default items-center justify-center bg-white">
            <ChevronDownIcon />
          </RadixSelect.ScrollDownButton>
        </RadixSelect.Content>
      </RadixSelect.Portal>
    </RadixSelect.Root>
  );
}

const SelectItem = ({ value }: SelectItemOptions) => {
  return (
    <RadixSelect.Item value={value}>
      <RadixSelect.ItemText className="text-left">{value}</RadixSelect.ItemText>
      <RadixSelect.ItemIndicator className="absolute left-0 inline-flex w-[25px] items-center justify-center">
        <ArrowUpRightIcon />
      </RadixSelect.ItemIndicator>
    </RadixSelect.Item>
  );
};
