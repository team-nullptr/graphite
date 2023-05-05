import { Editable } from "../../../shared/Editable";
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
    <nav className="flex w-full items-center justify-center border-b border-base-300 p-2">
      <button onClick={navigateBackHandler} className="aspect-square h-full">
        <ArrowLeftIcon className="w-5" />
      </button>
      <Editable
        className="ml-3 h-[28px] w-96 rounded-md border border-base-300 text-center"
        placeholder="Project"
        value={props.name}
        onChange={editableChangeHandler}
        disabled={props.disabled}
      ></Editable>
    </nav>
  );
};
