import { MoonIcon, SunIcon, SparklesIcon } from "@heroicons/react/24/outline";
import { useTheme } from "../context/theme";

export const ThemeToggler = () => {
  const { mode, toggle } = useTheme();

  return (
    <div
      className="flex h-8 w-8 cursor-pointer items-center  justify-center rounded-lg bg-slate-50 text-slate-800"
      onClick={toggle}
    >
      {mode === "auto" && <SparklesIcon className="h-6 w-6" />}
      {mode === "dark" && <MoonIcon className="h-6 w-6" />}
      {mode === "light" && <SunIcon className="h-6 w-6" />}
    </div>
  );
};
