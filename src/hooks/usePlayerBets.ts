import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";

import { Api } from "../lib/api";
import type { Bet } from "../lib/types";

type PlayerRef = { id: number; username: string };

export function usePlayerBets(
  tournamentId: number,
  player: PlayerRef | null,
  limit = 50
) {
  const q = useQuery({
    queryKey: ["bets", tournamentId],
    queryFn: () => Api.bets(tournamentId),
    enabled: tournamentId > 0,
    staleTime: 5_000,
  });

  const data = useMemo<Bet[] | undefined>(() => {
    if (!q.data || !player) return undefined;

    // 1) Try strict match by playerId (preferred)
    const byId = q.data.filter((b) => b.playerId === player.id);
    if (byId.length > 0) {
      return byId.slice(0, limit);
    }

    // 2) Fallback by username (case-insensitive, unicode-safe)
    const normalize = (s: string) => s.normalize("NFKC").toLocaleLowerCase();

    const target = normalize(player.username);
    const byName = q.data.filter((b) => normalize(b.playerUsername) === target);

    return byName.slice(0, limit);
  }, [q.data, player, limit]);

  return { ...q, data };
}
