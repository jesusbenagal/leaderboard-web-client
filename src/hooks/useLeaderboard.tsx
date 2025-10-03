import { useQuery, useQueryClient } from "@tanstack/react-query";

import { Api } from "../lib/api";

import { useWebSocket } from "./useWebSocket";

import type { WsMessage, LeaderboardEntry } from "../lib/types";

export function useLeaderboard(tournamentId: number) {
  const client = useQueryClient();
  const queryKey = ["leaderboard", tournamentId];

  const leaderboardQ = useQuery({
    queryKey,
    queryFn: () => Api.leaderboard(tournamentId),
    enabled: tournamentId > 0,
    staleTime: 15_000,
  });

  useWebSocket((msg: WsMessage) => {
    if (msg.type !== "leaderboard_update" || msg.tournamentId !== tournamentId)
      return;

    // Replace with authoritative snapshot; keep stable rank ordering
    client.setQueryData<LeaderboardEntry[]>(queryKey, () =>
      [...msg.leaderboard].sort((a, b) => a.rank - b.rank)
    );
  });

  return leaderboardQ;
}
