import { memo } from "react";
import { motion } from "framer-motion";
import { clsx } from "clsx";

import type { LeaderboardEntry } from "../lib/types";
import { formatCurrency } from "../lib/format";

type Props = { row: LeaderboardEntry };

export const LeaderboardRow = memo(function LeaderboardRow({ row }: Props) {
  const isTop3 = row.rank <= 3;
  const prizeColor = row.rank <= 5 ? "text-green-400" : "text-slate-300";
  const avatar =
    row.avatar ??
    `https://api.dicebear.com/7.x/avataaars/svg?seed=${row.playerId}`;

  return (
    <motion.li
      layout
      layoutId={`row-${row.playerId}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={clsx(
        "lb-grid items-center px-2 py-3 rounded-lg",
        row.rank % 2 === 0 ? "bg-slate-800/60" : "bg-slate-800/40"
      )}
      role="listitem"
    >
      <div className="flex items-center gap-2">
        <span
          className={clsx(
            "rank-badge h-8 w-8 grid place-content-center text-xs font-semibold",
            isTop3
              ? "bg-amber-500/25 border border-amber-300/40 text-amber-200"
              : "bg-slate-700/40 border border-slate-600 text-slate-300"
          )}
        >
          {row.rank}
        </span>
      </div>
      <div className="flex items-center gap-3 min-w-0">
        <img
          src={avatar}
          alt={row.username}
          className="h-8 w-8 shrink-0 rounded-full border border-slate-700 bg-slate-800"
          loading="lazy"
        />
        <span className="truncate font-medium">{row.username}</span>
      </div>
      <div
        className={clsx(
          "text-right font-semibold tabular-nums whitespace-nowrap pr-3 sm:pr-0",
          prizeColor
        )}
      >
        {formatCurrency(row.totalBets)}
      </div>
    </motion.li>
  );
});
