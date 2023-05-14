import {
  PropsWithChildren,
  createContext,
  useState,
  useEffect,
  useContext,
} from "react";

export type Theme = "light" | "dark";
export type ThemeMode = Theme | "auto";

type ThemeContextValue = {
  // Mode decides on the way theme is resolved.
  theme: Theme;
  mode: ThemeMode;
  themeClass: string;
  toggle: () => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

export const useTheme = () => {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error("useTheme must be used within ThemeContext.Provider.");
  }

  return context;
};

export const ThemeContextProvider = (props: PropsWithChildren) => {
  const [mode, setMode] = useState<ThemeMode>(
    (localStorage.getItem("themeMode") as ThemeMode) ?? "auto"
  );
  const [theme, setTheme] = useState<Theme>("light");

  // Save theme mode to local storage.
  useEffect(() => {
    localStorage.setItem("themeMode", mode);
  }, [mode]);

  // Change theme in real time when user preference changes and theme mode is set to auto.
  useEffect(() => {
    const mql = window.matchMedia("(prefers-color-scheme: dark)");

    const applyTheme = (e: MediaQueryListEvent) => {
      if (mode !== "auto") return;
      setTheme(e.matches ? "dark" : "light");
    };

    mql.addEventListener("change", applyTheme);

    return () => mql.removeEventListener("change", applyTheme);
  }, []);

  // Change theme when theme mode changes.
  useEffect(() => {
    if (mode === "auto") {
      const mql = window.matchMedia("(prefers-color-scheme: dark)");
      setTheme(mql.matches ? "dark" : "light");
      return;
    }

    setTheme(mode);
  }, [mode]);

  const transitions: Record<ThemeMode, ThemeMode> = {
    auto: "dark",
    dark: "light",
    light: "auto",
  };

  const toggle = () => setMode(transitions[mode]);

  // See tailwind docs on dark theme.
  const themeClass = theme === "dark" ? "dark" : "";

  return (
    <ThemeContext.Provider value={{ theme, mode, toggle, themeClass }}>
      {props.children}
    </ThemeContext.Provider>
  );
};
