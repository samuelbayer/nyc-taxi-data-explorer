import { describe, expect, it } from "vitest";
import { detectLanguage, LANGUAGES, MESSAGES } from "./messages";

describe("detectLanguage", () => {
  it("uses the first supported language in preference order", () => {
    expect(detectLanguage(["ja-JP", "es-MX", "en-US"])).toBe("es");
  });

  it("matches regional variants by base language", () => {
    expect(detectLanguage(["pt-PT"])).toBe("pt");
    expect(detectLanguage(["DE-at"])).toBe("de");
  });

  it("falls back to English", () => {
    expect(detectLanguage(["ja-JP", "zh-CN"])).toBe("en");
    expect(detectLanguage([])).toBe("en");
  });
});

describe("messages", () => {
  it("has seven payment labels in every language", () => {
    for (const lang of LANGUAGES) {
      expect(MESSAGES[lang].payment).toHaveLength(7);
    }
  });
});
