import { Editable } from "../../../shared/Editable";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { ThemeToggler } from "../../../shared/ThemeToggler";

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
    <nav className="flex w-full items-center justify-center border-b border-base-300 bg-base-200 p-2 dark:border-base-200-dark dark:bg-base-300-dark">
      {/* FIXME: This is of course the stupidest place for theme switcher, but it has to be somewhere for now. */}
      <ThemeToggler />
      <button
        onClick={navigateBackHandler}
        className="h-fulltext-text-base aspect-square dark:text-text-base-dark"
      >
        <ArrowLeftIcon className="w-5" />
      </button>
      <Editable
        className="ml-3 h-[28px] w-96 rounded-md border border-base-300 bg-base-200 text-center text-text-base placeholder:text-text-dimmed dark:border-base-200-dark dark:bg-base-300-dark dark:text-text-base-dark dark:placeholder:text-text-dimmed-dark"
        placeholder="Project"
        value={props.name}
        onChange={editableChangeHandler}
        disabled={props.disabled}
      ></Editable>
    </nav>
  );
};
