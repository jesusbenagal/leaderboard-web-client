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
      <div className="relative h-[200px] sm:h-[220px] md:h-[260px]">
        <div className="absolute inset-0">
          <img
            src={tournament.image}
            alt={tournament.name}
            className="w-full h-full object-cover"
            loading="eager"
            decoding="async"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />

        <div className="absolute inset-0 p-4 sm:p-5 md:p-6 flex flex-col justify-between">
          <div>
            <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold flex items-start sm:items-center gap-2 flex-wrap">
              <span className="inline-flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-amber-500/30 border border-amber-400/40 backdrop-blur-sm shadow-lg">
                💰
              </span>
              <span className="text-white drop-shadow-lg leading-tight">
                {tournament.name}
              </span>
            </h2>
            <p className="text-slate-100 text-xs sm:text-sm mt-2 ml-0 sm:ml-10 drop-shadow-md">
              Prize pool:{" "}
              <span className="text-green-400 font-semibold">
                {formatCurrency(tournament.totalPrizePool)}
              </span>
            </p>
          </div>

          <div className="flex justify-end">
            <div
              className={clsx(
                "rounded-lg border px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm flex items-center gap-2 shadow-xl",
                "border-slate-600/60 bg-slate-900/95 backdrop-blur-md"
              )}
              title={ended ? "Tournament ended" : "Time remaining"}
            >
              <span className="text-slate-200 hidden sm:inline">Ends in:</span>
              <span className="text-slate-200 sm:hidden">⏱</span>
              <span className="font-mono font-semibold text-white">
                {days}d {hours}h {minutes}m
              </span>
            </div>
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
