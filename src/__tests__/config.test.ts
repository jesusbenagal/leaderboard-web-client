import { describe, it, expect } from "vitest";
import { API_URL, WS_URL } from "../config";

describe("config", () => {
  it("exports API_URL as a string", () => {
    expect(typeof API_URL).toBe("string");
  });

  it("exports WS_URL as a string", () => {
    expect(typeof WS_URL).toBe("string");
  });

  it("API_URL has a valid format", () => {
    expect(API_URL).toMatch(/^https?:\/\//);
  });

  it("WS_URL has a valid format", () => {
    expect(WS_URL).toMatch(/^wss?:\/\//);
  });

  it("API_URL is not empty", () => {
    expect(API_URL.length).toBeGreaterThan(0);
  });

  it("WS_URL is not empty", () => {
    expect(WS_URL.length).toBeGreaterThan(0);
  });

  it("API_URL contains localhost or a valid domain", () => {
    expect(API_URL).toMatch(/(localhost|\.com|\.org|\.net|\.io)/);
  });

  it("WS_URL contains localhost or a valid domain", () => {
    expect(WS_URL).toMatch(/(localhost|\.com|\.org|\.net|\.io)/);
  });

  it("API_URL and WS_URL are different", () => {
    expect(API_URL).not.toBe(WS_URL);
  });

  it("API_URL uses http or https protocol", () => {
    expect(API_URL).toMatch(/^https?:\/\//);
  });

  it("WS_URL uses ws or wss protocol", () => {
    expect(WS_URL).toMatch(/^wss?:\/\//);
  });
});
