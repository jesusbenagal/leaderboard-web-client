import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { timeAgo } from "../time";

describe("time utilities", () => {
  beforeEach(() => {
    // Mock Date.now() to have a consistent reference point
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2024-01-15T12:00:00Z"));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe("timeAgo", () => {
    it("returns seconds for times less than 1 minute", () => {
      const now = new Date("2024-01-15T12:00:00Z");
      const thirtySecondsAgo = new Date("2024-01-15T11:59:30Z");

      vi.setSystemTime(now);
      const result = timeAgo(thirtySecondsAgo.toISOString());

      expect(result).toBe("30s");
    });

    it("returns seconds for times just under 1 minute", () => {
      const now = new Date("2024-01-15T12:00:00Z");
      const fiftyNineSecondsAgo = new Date("2024-01-15T11:59:01Z");

      vi.setSystemTime(now);
      const result = timeAgo(fiftyNineSecondsAgo.toISOString());

      expect(result).toBe("59s");
    });

    it("returns minutes for times between 1 and 59 minutes", () => {
      const now = new Date("2024-01-15T12:00:00Z");
      const thirtyMinutesAgo = new Date("2024-01-15T11:30:00Z");

      vi.setSystemTime(now);
      const result = timeAgo(thirtyMinutesAgo.toISOString());

      expect(result).toBe("30m");
    });

    it("returns minutes for times just under 1 hour", () => {
      const now = new Date("2024-01-15T12:00:00Z");
      const fiftyNineMinutesAgo = new Date("2024-01-15T11:01:00Z");

      vi.setSystemTime(now);
      const result = timeAgo(fiftyNineMinutesAgo.toISOString());

      expect(result).toBe("59m");
    });

    it("returns hours for times between 1 and 23 hours", () => {
      const now = new Date("2024-01-15T12:00:00Z");
      const sixHoursAgo = new Date("2024-01-15T06:00:00Z");

      vi.setSystemTime(now);
      const result = timeAgo(sixHoursAgo.toISOString());

      expect(result).toBe("6h");
    });

    it("returns hours for times just under 24 hours", () => {
      const now = new Date("2024-01-15T12:00:00Z");
      const twentyThreeHoursAgo = new Date("2024-01-14T13:00:00Z");

      vi.setSystemTime(now);
      const result = timeAgo(twentyThreeHoursAgo.toISOString());

      expect(result).toBe("23h");
    });

    it("returns days for times 24 hours or more", () => {
      const now = new Date("2024-01-15T12:00:00Z");
      const twoDaysAgo = new Date("2024-01-13T12:00:00Z");

      vi.setSystemTime(now);
      const result = timeAgo(twoDaysAgo.toISOString());

      expect(result).toBe("2d");
    });

    it("returns days for times much more than 24 hours", () => {
      const now = new Date("2024-01-15T12:00:00Z");
      const tenDaysAgo = new Date("2024-01-05T12:00:00Z");

      vi.setSystemTime(now);
      const result = timeAgo(tenDaysAgo.toISOString());

      expect(result).toBe("10d");
    });

    it("handles edge case of exactly 1 minute", () => {
      const now = new Date("2024-01-15T12:00:00Z");
      const oneMinuteAgo = new Date("2024-01-15T11:59:00Z");

      vi.setSystemTime(now);
      const result = timeAgo(oneMinuteAgo.toISOString());

      expect(result).toBe("1m");
    });

    it("handles edge case of exactly 1 hour", () => {
      const now = new Date("2024-01-15T12:00:00Z");
      const oneHourAgo = new Date("2024-01-15T11:00:00Z");

      vi.setSystemTime(now);
      const result = timeAgo(oneHourAgo.toISOString());

      expect(result).toBe("1h");
    });

    it("handles edge case of exactly 24 hours", () => {
      const now = new Date("2024-01-15T12:00:00Z");
      const oneDayAgo = new Date("2024-01-14T12:00:00Z");

      vi.setSystemTime(now);
      const result = timeAgo(oneDayAgo.toISOString());

      expect(result).toBe("1d");
    });

    it("handles future dates (negative delta)", () => {
      const now = new Date("2024-01-15T12:00:00Z");
      const futureTime = new Date("2024-01-15T12:00:30Z");

      vi.setSystemTime(now);
      const result = timeAgo(futureTime.toISOString());

      // Should handle negative delta gracefully
      expect(result).toBe("-30s");
    });

    it("handles very recent times (0 seconds)", () => {
      const now = new Date("2024-01-15T12:00:00Z");
      const sameTime = new Date("2024-01-15T12:00:00Z");

      vi.setSystemTime(now);
      const result = timeAgo(sameTime.toISOString());

      expect(result).toBe("0s");
    });

    it("handles very old dates", () => {
      const now = new Date("2024-01-15T12:00:00Z");
      const veryOldTime = new Date("2020-01-01T00:00:00Z");

      vi.setSystemTime(now);
      const result = timeAgo(veryOldTime.toISOString());

      // Should be many days
      expect(result).toMatch(/^\d+d$/);
      expect(parseInt(result)).toBeGreaterThan(1000); // More than 1000 days
    });
  });
});
