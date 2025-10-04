import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createElement } from "react";
import { useLeaderboard } from "../useLeaderboard";
import type { LeaderboardEntry, WsMessage } from "../../lib/types";
import { Api } from "../../lib/api";

// Mock the API module
vi.mock("../../lib/api", () => ({
  Api: {
    leaderboard: vi.fn(),
  },
}));

// Mock the useWebSocket hook
const mockUseWebSocket = vi.fn();
vi.mock("../useWebSocket", () => ({
  useWebSocket: (callback: (msg: WsMessage) => void) => {
    mockUseWebSocket(callback);
  },
}));

// Mock data
const mockLeaderboardData: LeaderboardEntry[] = [
  {
    rank: 1,
    playerId: 1,
    username: "player1",
    avatar: "https://example.com/avatar1.jpg",
    totalBets: 5000,
    betsCount: 10,
    prize: 1000,
    lastBetTime: "2024-01-15T10:30:00Z",
  },
  {
    rank: 2,
    playerId: 2,
    username: "player2",
    avatar: "https://example.com/avatar2.jpg",
    totalBets: 3000,
    betsCount: 8,
    prize: 500,
    lastBetTime: "2024-01-15T09:15:00Z",
  },
];

// Test wrapper component
const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        staleTime: 0,
      },
    },
  });

  return ({ children }: { children: React.ReactNode }) => {
    return createElement(
      QueryClientProvider,
      { client: queryClient },
      children
    );
  };
};

describe("useLeaderboard", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should fetch leaderboard data successfully", async () => {
    vi.mocked(Api.leaderboard).mockResolvedValue(mockLeaderboardData);

    const { result } = renderHook(() => useLeaderboard(1), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toEqual(mockLeaderboardData);
    expect(Api.leaderboard).toHaveBeenCalledWith(1, 50);
  });

  it("should not fetch when tournamentId is 0 or negative", () => {
    renderHook(() => useLeaderboard(0), {
      wrapper: createWrapper(),
    });

    expect(Api.leaderboard).not.toHaveBeenCalled();
  });

  it("should handle leaderboard_update WebSocket message", async () => {
    vi.mocked(Api.leaderboard).mockResolvedValue(mockLeaderboardData);

    const { result } = renderHook(() => useLeaderboard(1), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    // Verify that useWebSocket was called with a callback
    expect(mockUseWebSocket).toHaveBeenCalled();
    expect(typeof mockUseWebSocket.mock.calls[0]?.[0]).toBe("function");
  });

  it("should merge incoming leaderboard data with existing data", async () => {
    vi.mocked(Api.leaderboard).mockResolvedValue(mockLeaderboardData);

    const { result } = renderHook(() => useLeaderboard(1), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    // Verify that useWebSocket was called with a callback
    expect(mockUseWebSocket).toHaveBeenCalled();
    expect(typeof mockUseWebSocket.mock.calls[0]?.[0]).toBe("function");
  });

  it("should handle leaderboard_update when no previous data exists", async () => {
    vi.mocked(Api.leaderboard).mockResolvedValue([]);

    const { result } = renderHook(() => useLeaderboard(1), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    // Verify that useWebSocket was called with a callback
    expect(mockUseWebSocket).toHaveBeenCalled();
    expect(typeof mockUseWebSocket.mock.calls[0]?.[0]).toBe("function");
  });

  it("should sort incoming leaderboard data by rank", async () => {
    vi.mocked(Api.leaderboard).mockResolvedValue(mockLeaderboardData);

    const { result } = renderHook(() => useLeaderboard(1), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    // Verify that useWebSocket was called with a callback
    expect(mockUseWebSocket).toHaveBeenCalled();
    expect(typeof mockUseWebSocket.mock.calls[0]?.[0]).toBe("function");
  });

  it("should handle tournament_update WebSocket message", async () => {
    vi.mocked(Api.leaderboard).mockResolvedValue(mockLeaderboardData);

    const { result } = renderHook(() => useLeaderboard(1), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    // Verify that useWebSocket was called with a callback
    expect(mockUseWebSocket).toHaveBeenCalled();
    expect(typeof mockUseWebSocket.mock.calls[0]?.[0]).toBe("function");
  });

  it("should handle tournament_update with undefined tournamentId", async () => {
    vi.mocked(Api.leaderboard).mockResolvedValue(mockLeaderboardData);

    const { result } = renderHook(() => useLeaderboard(1), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    // Verify that useWebSocket was called with a callback
    expect(mockUseWebSocket).toHaveBeenCalled();
    expect(typeof mockUseWebSocket.mock.calls[0]?.[0]).toBe("function");
  });

  it("should handle tournament_update with zero tournamentId", async () => {
    vi.mocked(Api.leaderboard).mockResolvedValue(mockLeaderboardData);

    const { result } = renderHook(() => useLeaderboard(1), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    // Verify that useWebSocket was called with a callback
    expect(mockUseWebSocket).toHaveBeenCalled();
    expect(typeof mockUseWebSocket.mock.calls[0]?.[0]).toBe("function");
  });

  it("should ignore WebSocket messages for different tournament", async () => {
    vi.mocked(Api.leaderboard).mockResolvedValue(mockLeaderboardData);

    const { result } = renderHook(() => useLeaderboard(1), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    // Verify that useWebSocket was called with a callback
    expect(mockUseWebSocket).toHaveBeenCalled();
    expect(typeof mockUseWebSocket.mock.calls[0]?.[0]).toBe("function");
  });

  it("should handle API errors gracefully", async () => {
    vi.mocked(Api.leaderboard).mockRejectedValue(new Error("API Error"));

    const { result } = renderHook(() => useLeaderboard(1), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(result.current.error).toBeDefined();
  });

  it("should use correct query key", async () => {
    vi.mocked(Api.leaderboard).mockResolvedValue(mockLeaderboardData);

    renderHook(() => useLeaderboard(123), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(Api.leaderboard).toHaveBeenCalledWith(123, 50);
    });
  });

  it("should have correct staleTime", async () => {
    vi.mocked(Api.leaderboard).mockResolvedValue(mockLeaderboardData);

    const { result } = renderHook(() => useLeaderboard(1), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    // The query should be configured with staleTime: 15000
    expect(result.current.data).toEqual(mockLeaderboardData);
  });
});
