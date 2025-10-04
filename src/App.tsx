import { Applayout } from "./layouts/Applayout";

import { TournamentHeader } from "./components/TournamentHeader";
import { PrizeLegend } from "./components/PrizeLegend";
import { LeaderboardTable } from "./components/LeaderboardTable";
import { BetFeed } from "./components/BetFeed";

import { useAppData } from "./hooks/useAppData";

export default function App() {
  const { tournament, stats, leaderboard, bets, isLoading, isError } =
    useAppData();

  if (isLoading) {
    return (
      <div className="min-h-screen grid place-content-center">
        <p className="text-slate-400">Loading tournaments…</p>
      </div>
    );
  }

  if (isError || !tournament) {
    return (
      <div className="min-h-screen grid place-content-center">
        <p className="text-slate-400">No active tournaments</p>
      </div>
    );
  }

  return (
    <Applayout>
      <TournamentHeader tournament={tournament} {...(stats ? { stats } : {})} />
      <PrizeLegend tournament={tournament} />
      <div className="mt-4 grid gap-4 lg:grid-cols-[minmax(0,1fr)_380px]">
        <LeaderboardTable data={leaderboard} tournamentId={tournament.id} />
        <BetFeed bets={bets} />
      </div>
    </Applayout>
  );
}
