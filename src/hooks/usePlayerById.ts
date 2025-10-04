import { useMemo } from "react";

import { usePlayers } from "./usePlayers";

import type { Player } from "../lib/types";

export function usePlayerById(playerId: number | null | undefined) {
  const playersQ = usePlayers();

  const player = useMemo<Player | undefined>(() => {
    if (!playersQ.data || !playerId) return undefined;
    return playersQ.data.find((p) => p.id === playerId);
  }, [playersQ.data, playerId]);

  return { ...playersQ, data: player };
}
