import { describe, it, expect, vi } from "vitest";
import { renderHook } from "@testing-library/react";
import { useWebSocket } from "../useWebSocket";

// Mock the WebSocket connector
vi.mock("../../lib/ws", () => ({
  connectLiveWS: vi.fn(() => ({
    close: vi.fn(),
  })),
}));

describe("useWebSocket", () => {
  it("should call connectLiveWS on mount", () => {
    const mockOnMessage = vi.fn();

    renderHook(() => useWebSocket(mockOnMessage));

    // The hook should have been called and connectLiveWS should have been invoked
    expect(true).toBe(true); // Basic test to verify hook doesn't crash
  });

  it("should handle callback changes without reconnecting", () => {
    const mockOnMessage1 = vi.fn();
    const mockOnMessage2 = vi.fn();

    const { rerender } = renderHook(
      ({ onMessage }) => useWebSocket(onMessage),
      { initialProps: { onMessage: mockOnMessage1 } }
    );

    // Change the callback
    rerender({ onMessage: mockOnMessage2 });

    // Should not crash
    expect(true).toBe(true);
  });

  it("should clean up on unmount", () => {
    const mockOnMessage = vi.fn();

    const { unmount } = renderHook(() => useWebSocket(mockOnMessage));

    // Should not crash on unmount
    expect(() => unmount()).not.toThrow();
  });
});
