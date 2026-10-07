import { useCallback, useEffect, useMemo, useState } from "react";

import { ThemeContext, type Theme } from "./themeContext";

const STORAGE_KEY = "theme";
const QUERY = "(prefers-color-scheme: dark)";

function storedTheme(): Theme | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored === "light" || stored === "dark" ? stored : null;
  } catch {
    return null;
  }
}

/** Follows the system theme until the visitor picks one explicitly. */
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [chosen, setChosen] = useState<Theme | null>(storedTheme);
  const [system, setSystem] = useState<Theme>(() =>
    window.matchMedia(QUERY).matches ? "dark" : "light",
  );

  useEffect(() => {
    const media = window.matchMedia(QUERY);
    const onChange = (e: MediaQueryListEvent) =>
      setSystem(e.matches ? "dark" : "light");
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, []);

  const theme = chosen ?? system;

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  const toggle = useCallback(() => {
    const next: Theme = theme === "dark" ? "light" : "dark";
    setChosen(next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      /* ignore */
    }
  }, [theme]);

  const value = useMemo(() => ({ theme, toggle }), [theme, toggle]);
  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}
