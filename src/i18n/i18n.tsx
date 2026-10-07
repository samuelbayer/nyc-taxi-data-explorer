import { useCallback, useEffect, useMemo, useState } from "react";
import { I18nContext } from "./context";
import { setFormatLang } from "../lib/format";
import { detectLanguage, isLang, MESSAGES, type Lang } from "./messages";

const STORAGE_KEY = "lang";

function initialLang(): Lang {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (isLang(stored)) return stored;
  } catch {
    /* storage can be blocked; fall through to detection */
  }
  return detectLanguage(
    navigator.languages?.length ? navigator.languages : [navigator.language],
  );
}

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>(() => {
    const initial = initialLang();
    setFormatLang(initial);
    return initial;
  });

  const setLang = useCallback((next: Lang) => {
    setFormatLang(next);
    setLangState(next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
    document
      .querySelector('meta[name="description"]')
      ?.setAttribute("content", MESSAGES[lang].metaDescription);
  }, [lang]);

  const value = useMemo(
    () => ({ lang, setLang, t: MESSAGES[lang] }),
    [lang, setLang],
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}
