import { Editable } from "~/shared/Editable";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";

export interface HeaderProps {
  name: string;
  onNavigateUp?: () => void;
  onRename?: (projectName: string) => void;
  disabled?: boolean;
}

export const Header = (props: HeaderProps) => {
  const navigateBackHandler = () => {
    props.onNavigateUp?.();
  };

  const editableChangeHandler = (name: string) => {
    props.onRename?.(name);
  };

  return (
    <nav className="flex h-12 w-full items-center justify-center gap-3 border-b border-slate-300 bg-slate-50 p-2">
      {/* FIXME: This is of course the stupidest place for theme switcher, but it has to be somewhere for now. */}
      <button
        onClick={navigateBackHandler}
        className="aspect-square h-full text-slate-800"
      >
        <ArrowLeftIcon className="w-5" />
      </button>
      <Editable
        className="h-[28px] w-96 rounded-md border border-slate-300 bg-slate-50 text-center text-slate-800 placeholder:text-slate-600"
        placeholder="Project"
        value={props.name}
        onChange={editableChangeHandler}
        disabled={props.disabled}
      />
    </nav>
  );
};
