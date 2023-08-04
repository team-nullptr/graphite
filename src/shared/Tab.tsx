import { PropsWithChildren } from "react";

export type TabProps = {
  label: string;
};

export const Tab = (props: PropsWithChildren<TabProps>) => {
  return (
    <div className="flex h-full w-full flex-col">
      <div className="flex w-full items-center gap-4 border-b border-slate-300 bg-slate-50 px-4 h-12  text-slate-800">
        {props.label}
      </div>
      <div className="flex-1">{props.children}</div>
    </div>
  );
};
