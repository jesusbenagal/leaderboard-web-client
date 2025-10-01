import { useQuery } from "@tanstack/react-query";
import { Api } from "./lib/api";

export default function App() {
  const tournamentsQ = useQuery({
    queryKey: ["tournaments"],
    queryFn: Api.tournaments,
  });

  if (tournamentsQ.isLoading) {
    return (
      <div className="min-h-screen grid place-content-center">
        <p className="text-slate-400">Loading tournaments…</p>
      </div>
    );
  }

  if (tournamentsQ.isError) {
    return (
      <div className="min-h-screen grid place-content-center">
        <p className="text-red-400">Failed to load tournaments</p>
      </div>
    );
  }

  const tournaments = tournamentsQ.data ?? [];
  const first = tournaments[0];

  return (
    <div className="min-h-screen grid place-content-center">
      <div className="rounded-xl border border-slate-800 bg-[#1a2029] p-6 max-w-lg">
        <h1 className="text-xl font-semibold">Live Tournament Leaderboard</h1>
        <p className="text-slate-400 text-sm mt-2">
          Loaded
          <span className="text-slate-200 font-medium">
            {tournaments.length}
          </span>
          tournament(s).
        </p>
        {first && (
          <div className="mt-3 text-sm">
            <p className="text-slate-300">
              <span className="text-slate-400">First:</span>
              <span className="font-medium">{first.name}</span>
            </p>
            <p className="text-slate-500">{first.status}</p>
          </div>
        )}
      </div>
    </div>
  );
}
