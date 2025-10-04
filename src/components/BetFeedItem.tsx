import { memo } from "react";
import { motion } from "framer-motion";

import type { Bet } from "../lib/types";
import { timeAgo } from "../lib/time";
import { formatCurrency } from "../lib/format";

export const BetFeedItem = memo(function BetFeedItem({ bet }: { bet: Bet }) {
  const avatar =
    bet.playerAvatar ??
    `https://api.dicebear.com/7.x/avataaars/svg?seed=${bet.playerId}`;

  return (
    <motion.li
      layout
      layoutId={`bet-${bet.id}`}
      initial={{ opacity: 0, y: -12, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -8, scale: 0.98 }}
      transition={{ type: "spring", stiffness: 380, damping: 28, mass: 0.5 }}
      className="relative flex items-center gap-3 rounded-lg bg-slate-800/50 px-3 py-2 border border-slate-700/60"
      role="listitem"
    >
      <motion.span
        aria-hidden
        initial={{ width: 6, opacity: 0.9 }}
        animate={{ width: 0, opacity: 0 }}
        transition={{ duration: 1.1, ease: "easeOut" }}
        className="absolute left-0 top-0 bottom-0 rounded-l-lg bg-green-500/60 pointer-events-none"
      />

      <img
        src={avatar}
        alt={bet.playerUsername}
        className="h-8 w-8 rounded-full border border-slate-700 bg-slate-800"
        loading="lazy"
      />

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm">
          <span className="font-medium">{bet.playerUsername}</span>
          <span className="text-slate-400"> • {bet.betType}</span>
        </p>
        <p className="text-xs text-slate-500">{timeAgo(bet.timestamp)} ago</p>
      </div>

      <div className="text-right font-semibold text-green-400 tabular-nums">
        {formatCurrency(bet.amount)}
      </div>
    </motion.li>
  );
});
