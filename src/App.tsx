import { useQuery } from "@tanstack/react-query";

import { Applayout } from "./layouts/Applayout";

import { TournamentHeader } from "./components/TournamentHeader";
import { PrizeLegend } from "./components/PrizeLegend";
import { LeaderboardTable } from "./components/LeaderboardTable";
import { BetFeed } from "./components/BetFeed";

import { Api } from "./lib/api";

import { useLeaderboard } from "./hooks/useLeaderboard";
import { useBetFeed } from "./hooks/useBetFeed";

export default function App() {
  const tournamentsQ = useQuery({
    queryKey: ["tournaments"],
    queryFn: Api.tournaments,
  });

  const tournament = tournamentsQ.data?.[1] ?? null;
  const tournamentId = tournament?.id ?? 0;

  const statsQ = useQuery({
    queryKey: ["stats", tournamentId],
    queryFn: () => Api.stats(tournamentId),
    enabled: tournamentId > 0,
    staleTime: 15_000,
  });

  const leaderboardQ = useLeaderboard(tournamentId);
  const betsQ = useBetFeed(tournamentId);

  if (tournamentsQ.isLoading) {
    return (
      <div className="min-h-screen grid place-content-center">
        <p className="text-slate-400">Loading tournaments…</p>
      </div>
    );
  }

  if (tournamentsQ.isError || !tournament) {
    return (
      <div className="min-h-screen grid place-content-center">
        <p className="text-slate-400">No active tournaments</p>
      </div>
    );
  }

  return (
    <Applayout>
      <TournamentHeader
        tournament={tournament}
        {...(statsQ.data ? { stats: statsQ.data } : {})}
      />
      <PrizeLegend tournament={tournament} />
      <div className="mt-4 grid gap-4 lg:grid-cols-[minmax(0,1fr)_380px]">
        <LeaderboardTable
          data={leaderboardQ.data}
          tournamentId={tournamentId}
        />
        <BetFeed bets={betsQ.data} />
      </div>
    </Applayout>
  );
}
