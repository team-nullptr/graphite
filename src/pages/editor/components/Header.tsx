import { Editable } from "~/shared/Editable";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { cn } from "~/lib/utils";
import { useLayoutSettingsStore } from "../store/layout";
import { LayoutVerticalIcon } from "~/shared/icons/LayoutVerticalIcon";
import { LayoutHorizontalIcon } from "~/shared/icons/LayoutHorizontalIcon";

export type HeaderProps = {
  name: string;
  onNavigateUp?: () => void;
  onRename?: (projectName: string) => void;
  disabled?: boolean;
  className?: string;
};

export const Header = ({ name, onNavigateUp, onRename, disabled, className }: HeaderProps) => {
  const { orientation, switchOrientation } = useLayoutSettingsStore((store) => store);

  const navigateBackHandler = () => {
    onNavigateUp?.();
  };

  const editableChangeHandler = (name: string) => {
    onRename?.(name);
  };

  return (
    <nav
      className={cn(
        "flex h-10 w-full items-center justify-center gap-3 border-b border-slate-300 bg-slate-50 p-2",
        className
      )}
    >
      <button onClick={navigateBackHandler} className="aspect-square h-full text-slate-800">
        <ArrowLeftIcon className="h-5 w-5" />
      </button>
      <Editable
        className="h-[28px] w-96 rounded-md border border-slate-300 bg-slate-50 text-center text-slate-800 placeholder:text-slate-600"
        placeholder="Project"
        value={name}
        onChange={editableChangeHandler}
        disabled={disabled}
      />
      <button onClick={switchOrientation}>
        {orientation === "horizontal" ? (
          <LayoutHorizontalIcon className="h-5 w-5 text-slate-800" />
        ) : (
          <LayoutVerticalIcon className="h-5 w-5 text-slate-800" />
        )}
      </button>
    </nav>
  );
};
