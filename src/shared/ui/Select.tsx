import { ChevronDownIcon, ChevronUpIcon, CheckIcon } from "@heroicons/react/24/outline";

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
      value={value}
    >
      <RadixSelect.Trigger
        aria-label={label}
        className="relative w-full rounded-md border  px-4 py-2 text-left text-sm outline-none "
      >
        <RadixSelect.Value placeholder={label} />
        <RadixSelect.Icon className="absolute bottom-0 right-2 top-0 my-auto h-4 w-4">
          <ChevronDownIcon />
        </RadixSelect.Icon>
      </RadixSelect.Trigger>
      <RadixSelect.Portal>
        <RadixSelect.Content className="w-full overflow-hidden rounded border border-slate-200 bg-slate-50">
          <RadixSelect.ScrollDownButton>
            <ChevronUpIcon />
          </RadixSelect.ScrollDownButton>
          <RadixSelect.Viewport>
            {values.map((val) => (
              <SelectItem key={val} value={val} />
            ))}
          </RadixSelect.Viewport>
          <RadixSelect.ScrollDownButton className="flex h-6 cursor-default items-center justify-center bg-white">
            <ChevronDownIcon />
          </RadixSelect.ScrollDownButton>
        </RadixSelect.Content>
      </RadixSelect.Portal>
    </RadixSelect.Root>
  );
}

const SelectItem = ({ value }: SelectItemOptions) => {
  return (
    <RadixSelect.Item
      value={value}
      className="relative flex h-9 select-none items-center rounded-sm pl-6 pr-8 text-sm leading-none data-[disabled]:pointer-events-none data-[highlighted]:bg-slate-100 data-[highlighted]:outline-none"
    >
      <RadixSelect.ItemText className="translate-x-3 text-left">
        Vertex {value}
      </RadixSelect.ItemText>
      <RadixSelect.ItemIndicator className="absolute right-3 inline-flex w-4 items-center justify-center">
        <CheckIcon />
      </RadixSelect.ItemIndicator>
    </RadixSelect.Item>
  );
};
