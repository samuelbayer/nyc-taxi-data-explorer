import { describe, it, expect } from "vitest";
import { formatDistance, formatDuration, formatMoney, formatPassengerNumber, formatTypePayment } from "./format";


describe("formatMoney", () => {
  it("formats cents as dollars", () => {
    const result = formatMoney(1500);
    expect(result).toBe('$15.00');
  })
  it("formats 0 cents", () => {
    const result = formatMoney(0);
    expect(result).toBe('$0.00');
  })
  it("keeps the minus sign for negative amounts", () => {
    const result = formatMoney(-300);
    expect(result).toBe('-$3.00');
  })
});
describe("formatDistance", () => {
  it("converts hundredths of a mile to miles", () => {
    const result = formatDistance(614);
    expect(result).toBe('6.14 mi');
  })
   it("formats 0 as 0.00 mi", () => {
    const result = formatDistance(0);
    expect(result).toBe('0.00 mi');
  })
  it("always shows two decimals", () => {
    const result = formatDistance(5);
    expect(result).toBe('0.05 mi');
  })
});
describe("formatDuration", () => {
  it("shows 0 min when the seconds are less than 60", () => {
    const result = formatDuration(59);
    expect(result).toBe('0 min');
  })
  it("shows only minutes under an hour", () => {
    const result = formatDuration(600);
    expect(result).toBe('10 min');
  })
  it("shows 0 min when it’s exactly one hour", () => {
    const result = formatDuration(3600);
    expect(result).toBe('1 h 0 min');
  })
  it("shows hours and minutes", () => {
    const result = formatDuration(5430);
    expect(result).toBe('1 h 30 min');
  })

});
describe("formatTypePayment", () => {
  it("maps code 1 to Credit Card", () => {
    const result = formatTypePayment(1);
    expect(result).toBe('Credit card');
  })
  it("maps code 2 to Cash", () => {
    const result = formatTypePayment(2);
    expect(result).toBe('Cash');
  })
  it("maps code 4 to Dispute", () => {
    const result = formatTypePayment(4);
    expect(result).toBe('Dispute');
  })
  it("returns N/A for unknown payment types", () => {
    const result = formatTypePayment(99);
    expect(result).toBe('N/A');
  })
  it("returns N/A for null type", () => {
    const result = formatTypePayment(null);
    expect(result).toBe('N/A');
  })
});
describe("formatPassengerNumber", () => {
  it("shows the number as text", () => {
    const result = formatPassengerNumber(1);
    expect(result).toBe('1');
  })
  it("shows a dash when passengers is null", () => {
    const result = formatPassengerNumber(null);
    expect(result).toBe('—');
  })
});

