import { AnimatePresence, motion } from "framer-motion";
import { LeaderboardRow } from "./LeaderboardRow";
import type { LeaderboardEntry } from "../lib/types";

/**
 * Leaderboard
 */
export function LeaderboardTable({
  data,
}: {
  data: LeaderboardEntry[] | undefined;
}) {
  return (
    <section className="mt-4 rounded-2xl overflow-hidden border border-slate-800 bg-[#1a2029]">
      <header className="px-4 py-3 border-b border-slate-800 bg-[#1f2630]">
        <div className="lb-grid text-slate-400 text-sm">
          <span>#</span>
          <span>Player</span>
          <span className="text-right pr-3 sm:pr-0">Wagers</span>
        </div>
      </header>

      <div className="p-2 lb-scroll">
        <motion.ul layout className="flex flex-col gap-2" role="list">
          <AnimatePresence initial={false}>
            {data?.slice(0, 30).map((row) => (
              <LeaderboardRow key={row.playerId} row={row} />
            ))}
          </AnimatePresence>
        </motion.ul>
      </div>
    </section>
  );
}
