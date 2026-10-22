import { describe, it, expect } from "vitest";
import { getPageNumbers } from "./pagination";

describe("getPageNumbers", () => {
  it("page = 0, pageCount = 75", () => {
    const result = getPageNumbers(0, 75);
    expect(result).toStrictEqual([0, 1, 2, 3, 4, "...", 74]);
  });
  it("page = 74, pageCount = 75", () => {
    const result = getPageNumbers(74, 75);
    expect(result).toStrictEqual([0, "...", 70, 71, 72, 73, 74]);
  });
  it("page = 37, pageCount = 75", () => {
    const result = getPageNumbers(37, 75);
    expect(result).toStrictEqual([0, "...", 36, 37, 38, "...", 74]);
  });
  it("page = 3, pageCount = 75", () => {
    const result = getPageNumbers(3, 75);
    expect(result).toStrictEqual([0, 1, 2, 3, 4, "...", 74]);
  });
  it("page = 2, pageCount = 75", () => {
    const result = getPageNumbers(2, 75);
    expect(result).toStrictEqual([0, 1, 2, 3, 4, "...", 74]);
  });
  it("page = 0, pageCount = 5", () => {
    const result = getPageNumbers(0, 5);
    expect(result).toStrictEqual([0, 1, 2, 3, 4]);
  });
  it("page = 0, pageCount = 1", () => {
    const result = getPageNumbers(0, 1);
    expect(result).toStrictEqual([0]);
  });
  it("page = 4, pageCount = 75", () => {
    const result = getPageNumbers(4, 75);
    expect(result).toStrictEqual([0, "...", 3, 4, 5, "...", 74]);
  });
  it("page = 70, pageCount = 75", () => {
    const result = getPageNumbers(70, 75);
    expect(result).toStrictEqual([0, "...", 69, 70, 71, "...", 74]);
  });
  it("page = 3, pageCount = 5", () => {
    const result = getPageNumbers(3, 5);
    expect(result).toStrictEqual([0, 1, 2, 3, 4]);
  });
  it("page = 0, pageCount = 7", () => {
    const result = getPageNumbers(0, 7);
    expect(result).toStrictEqual([0, 1, 2, 3, 4, 5, 6]);
  });
});
