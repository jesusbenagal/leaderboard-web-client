import { useQuery } from "@tanstack/react-query";

import { Applayout } from "./layouts/Applayout";

import { TournamentHeader } from "./components/TournamentHeader";
import { PrizeLegend } from "./components/PrizeLegend";

import { Api } from "./lib/api";

export default function App() {
  const tournamentsQ = useQuery({
    queryKey: ["tournaments"],
    queryFn: Api.tournaments,
  });

  const tournament = tournamentsQ.data?.[0] ?? null;
  const tournamentId = tournament?.id ?? 0;

  const statsQ = useQuery({
    queryKey: ["stats", tournamentId],
    queryFn: () => Api.stats(tournamentId),
    enabled: tournamentId > 0,
    staleTime: 15_000,
  });

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
    </Applayout>
  );
}
