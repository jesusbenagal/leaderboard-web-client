import { useQuery } from "@tanstack/react-query";
import { Api } from "../lib/api";
import { TOURNAMENT_CONFIG } from "../config/tournament";
import type { Tournament } from "../lib/types";

/**
 * Hook to fetch and select the active tournament
 * Encapsulates the logic for finding the tournament with ID 101
 */
export function useActiveTournament() {
  const tournamentsQ = useQuery({
    queryKey: ["tournaments"],
    queryFn: Api.tournaments,
  });

  const tournament =
    tournamentsQ.data?.find(
      (t: Tournament) => t.id === TOURNAMENT_CONFIG.ACTIVE_TOURNAMENT_ID
    ) ?? null;

  const tournamentId = tournament?.id ?? 0;

  return {
    tournament,
    tournamentId,
    isLoading: tournamentsQ.isLoading,
    isError: tournamentsQ.isError,
  };
}
