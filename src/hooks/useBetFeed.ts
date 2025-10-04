import { useQuery, useQueryClient } from "@tanstack/react-query";

import { useWebSocket } from "./useWebSocket";

import { Api } from "../lib/api";
import type { Bet, WsMessage } from "../lib/types";

export function useBetFeed(tournamentId: number) {
  const qc = useQueryClient();
  const key = ["bets", tournamentId] as const;

  const q = useQuery({
    queryKey: key,
    queryFn: () => Api.bets(tournamentId),
    enabled: tournamentId > 0,
    staleTime: 5_000,
  });

  useWebSocket((msg: WsMessage) => {
    if (msg.type !== "bet_placed") return;

    const anyMsg = msg as unknown as { tournamentId?: number };
    if (
      typeof anyMsg.tournamentId === "number" &&
      anyMsg.tournamentId !== tournamentId
    ) {
      return;
    }

    const incoming: Bet = {
      ...msg.bet,
      timestamp: msg.timestamp,
    };

    qc.setQueryData<Bet[]>(key, (prev = []) => {
      const exists = prev.find((b) => b.id === incoming.id);
      const next = exists
        ? [incoming, ...prev.filter((b) => b.id !== incoming.id)]
        : [incoming, ...prev];
      return next.slice(0, 30);
    });
  });

  return q;
}
