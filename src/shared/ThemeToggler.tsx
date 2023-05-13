import { MoonIcon, SunIcon, SparklesIcon } from "@heroicons/react/24/outline";
import { useTheme } from "../context/theme";

/** Little button that allows to change current theme. */
export const ThemeToggler = () => {
  const { mode, toggle } = useTheme();

  return (
    <div
      className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg border border-base-300 bg-base-200 text-text-base dark:border-base-200-dark dark:bg-base-300-dark dark:text-text-base-dark"
      onClick={toggle}
    >
      {mode === "auto" && <SparklesIcon className="h-6 w-6" />}
      {mode === "dark" && <MoonIcon className="h-6 w-6" />}
      {mode === "light" && <SunIcon className="h-6 w-6" />}
    </div>
  );
};
