// Hero banner with image, prize pool and a live countdown.
import { clsx } from "clsx";

import { Stat } from "./Stat";

import { useCountdown } from "../hooks/useCountdown";

import type { Tournament, TournamentStats } from "../lib/types";
import { formatCurrency, formatNumber } from "../lib/format";

type Props = { tournament: Tournament; stats?: TournamentStats };

export function TournamentHeader({ tournament, stats }: Props) {
  const { days, hours, minutes, ended } = useCountdown(tournament.endDate);

  return (
    <section className="rounded-2xl overflow-hidden shadow-card border border-slate-800">
      <div className="relative bg-slate-900">
        <img
          src={tournament.image}
          alt={tournament.name}
          className="h-40 w-full object-cover opacity-70"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#12161c] via-transparent to-transparent" />
        <div className="absolute inset-x-0 top-0 h-6 bg-diagonal-candy" />
        <div className="absolute inset-0 p-5 flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/20 text-amber-300 border border-amber-400/30">
                💰
              </span>
              {tournament.name}
            </h2>
            <p className="text-slate-400 text-sm">
              Prize pool:{" "}
              <span className="text-green-400 font-semibold">
                {formatCurrency(tournament.totalPrizePool)}
              </span>
            </p>
          </div>
          <div
            className={clsx(
              "rounded-xl border px-3 py-2 text-sm flex items-center gap-2",
              "border-slate-700 bg-slate-900/70"
            )}
            title={ended ? "Tournament ended" : "Time remaining"}
          >
            <span className="text-slate-400">Ends in:</span>
            <span className="font-mono">
              {days}d {hours}h {minutes}m
            </span>
          </div>
        </div>
      </div>

      {stats && (
        <div className="grid grid-cols-3 gap-4 p-4 bg-[#1a2029] border-t border-slate-800 text-sm">
          <Stat label="Total bets" value={formatNumber(stats.totalBets)} />
          <Stat
            label="Total volume"
            value={formatCurrency(stats.totalVolume)}
          />
          <Stat
            label="Active players"
            value={formatNumber(stats.activePlayers)}
          />
        </div>
      )}
    </section>
  );
}
