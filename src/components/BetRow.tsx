import { formatCurrency } from "../lib/format";
import type { Bet } from "../lib/types";

export function BetRow({ bet }: { bet: Bet }) {
  return (
    <li className="flex items-center justify-between gap-3 rounded-lg border border-slate-800 bg-slate-900/50 px-3 py-2">
      <div className="min-w-0">
        <p className="text-sm text-slate-200 truncate">
          {bet.betType} — <span className="text-slate-400">#{bet.id}</span>
        </p>
        <p className="text-xs text-slate-500 truncate">
          {new Date(bet.timestamp).toLocaleString()}
        </p>
      </div>
      <div className="text-green-400 font-semibold">
        {formatCurrency(bet.amount)}
      </div>
    </li>
  );
}
