import { describe, it, expect } from "vitest";
import { formatCurrency, formatNumber, formatDate } from "../format";

describe("format utilities", () => {
  describe("formatCurrency", () => {
    it("formats currency with default EUR and es-ES locale", () => {
      const result = formatCurrency(1234.56);
      expect(result).toBe("1235\u00A0€");
    });

    it("formats currency with custom currency and locale", () => {
      const result = formatCurrency(1234.56, "USD", "en-US");
      expect(result).toBe("$1,235");
    });

    it("formats zero correctly", () => {
      const result = formatCurrency(0);
      expect(result).toBe("0\u00A0€");
    });

    it("formats negative numbers correctly", () => {
      const result = formatCurrency(-1234.56);
      expect(result).toBe("-1235\u00A0€");
    });
  });

  describe("formatNumber", () => {
    it("formats number with default es-ES locale", () => {
      const result = formatNumber(1234567.89);
      expect(result).toBe("1.234.567,89");
    });

    it("formats number with custom locale", () => {
      const result = formatNumber(1234567.89, "en-US");
      expect(result).toBe("1,234,567.89");
    });

    it("formats zero correctly", () => {
      const result = formatNumber(0);
      expect(result).toBe("0");
    });
  });

  describe("formatDate", () => {
    it("formats date with default es-ES locale", () => {
      const result = formatDate("2024-01-15");
      expect(result).toBe("15/1/2024");
    });

    it("formats date with custom locale", () => {
      const result = formatDate("2024-01-15", "en-US");
      expect(result).toBe("1/15/2024");
    });

    it("handles invalid date gracefully", () => {
      expect(() => formatDate("invalid-date")).toThrow();
    });
  });
});
