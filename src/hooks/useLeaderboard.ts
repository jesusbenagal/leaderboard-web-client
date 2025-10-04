import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Api } from "../lib/api";
import type { LeaderboardEntry, WsMessage } from "../lib/types";
import { useWebSocket } from "./useWebSocket";

/**
 * Fetch + realtime cache updates.
 * - Uses the message's tournamentId as the cache key (race-proof).
 * - Merges incoming snapshot with previous data by playerId to preserve fields the WS may omit.
 */
export function useLeaderboard(tournamentId: number) {
  const queryClient = useQueryClient();

  const leaderboardQ = useQuery({
    queryKey: ["leaderboard", tournamentId],
    queryFn: () => Api.leaderboard(tournamentId, 50),
    enabled: tournamentId > 0,
    staleTime: 15_000,
  });

  useWebSocket((msg: WsMessage) => {
    if (msg.type === "leaderboard_update") {
      const keyForMsg = ["leaderboard", msg.tournamentId] as const;

      queryClient.setQueryData<LeaderboardEntry[]>(keyForMsg, (prev) => {
        const incoming = [...msg.leaderboard].sort((a, b) => a.rank - b.rank);

        if (!prev || prev.length === 0) {
          return incoming as LeaderboardEntry[];
        }

        const prevById = new Map(prev.map((p) => [p.playerId, p]));
        const merged = incoming.map((n) => {
          const old = prevById.get(n.playerId);
          return { ...old, ...n } as LeaderboardEntry;
        });
        return merged;
      });

      return;
    }

    if (msg.type === "tournament_update") {
      const tid = msg.tournamentId ?? tournamentId;
      if (tid > 0) {
        queryClient.invalidateQueries({ queryKey: ["stats", tid] });
      }
    }
  });

  return leaderboardQ;
}
