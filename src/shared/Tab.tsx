import { PropsWithChildren } from "react";

export type TabProps = {
  label: string;
};

export const Tab = (props: PropsWithChildren<TabProps>) => {
  return (
    <div className="flex h-full w-full flex-col">
      <div className="flex w-full items-center gap-4 border-b border-base-300 bg-base-200 px-4 py-2 text-text-base dark:border-base-200-dark dark:bg-base-300-dark dark:text-text-base-dark">
        {props.label}
      </div>
      <div className="flex-1">{props.children}</div>
    </div>
  );
};
