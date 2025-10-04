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
            <div className="inline-flex max-w-[min(100%,68ch)] flex-col gap-2 rounded-xl bg-black/65 backdrop-blur-[2px] px-3 py-2 shadow-[0_8px_30px_rgba(0,0,0,0.35)]">
              <div className="flex items-center gap-2">
                <span className="inline-flex h-7 w-7 sm:h-8 sm:w-8 shrink-0 items-center justify-center rounded-lg bg-amber-500/30 border border-amber-400/40 shadow-md">
                  💰
                </span>
                <span className="text-white font-extrabold leading-snug tracking-tight text-xl sm:text-xl md:text-2xl">
                  {tournament.name}
                </span>
              </div>
              <p className="text-slate-100 text-xs sm:text-sm pl-9 sm:pl-10">
                Prize pool:{" "}
                <span className="text-green-400 font-semibold">
                  {formatCurrency(tournament.totalPrizePool)}
                </span>
              </p>
            </div>
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
