import { useQuery } from "@tanstack/react-query";
import { Api } from "../lib/api";
import { useActiveTournament } from "./useActiveTournament";
import { useLeaderboard } from "./useLeaderboard";
import { useBetFeed } from "./useBetFeed";

/**
 * Main data hook that encapsulates all data fetching logic for the App component
 * Provides a clean interface with all necessary data and loading states
 */
export function useAppData() {
  const {
    tournament,
    tournamentId,
    isLoading: tournamentLoading,
    isError: tournamentError,
  } = useActiveTournament();

  const statsQ = useQuery({
    queryKey: ["stats", tournamentId],
    queryFn: () => Api.stats(tournamentId),
    enabled: tournamentId > 0,
    staleTime: 15_000,
  });

  const leaderboardQ = useLeaderboard(tournamentId);
  const betsQ = useBetFeed(tournamentId);

  return {
    tournament,
    tournamentId,
    stats: statsQ.data,
    leaderboard: leaderboardQ.data,
    bets: betsQ.data,
    isLoading: tournamentLoading,
    isError: tournamentError,
  };
}
