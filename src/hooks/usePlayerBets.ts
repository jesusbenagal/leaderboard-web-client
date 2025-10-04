import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";

import { Api } from "../lib/api";

import type { Bet } from "../lib/types";

export function usePlayerBets(
  tournamentId: number,
  playerId: number | null | undefined,
  limit = 50
) {
  const betsQ = useQuery({
    queryKey: ["bets", tournamentId],
    queryFn: () => Api.bets(tournamentId),
    enabled: tournamentId > 0,
    staleTime: 5_000,
  });

  const data = useMemo<Bet[] | undefined>(() => {
    if (!betsQ.data || !playerId) return undefined;
    return betsQ.data.filter((b) => b.playerId === playerId).slice(0, limit);
  }, [betsQ.data, playerId, limit]);

  return { ...betsQ, data };
}
