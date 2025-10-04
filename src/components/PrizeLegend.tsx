import { formatCurrency } from "../lib/format";
import type { Tournament } from "../lib/types";

export function PrizeLegend({ tournament }: { tournament: Tournament }) {
  const entries = Object.entries(tournament.prizes)
    .sort((a, b) => parseInt(a[0]) - parseInt(b[0]))
    .slice(0, 5);

  return (
    <aside className="mt-4 rounded-xl border border-slate-800 bg-[#1a2029] p-4">
      <h3 className="text-sm text-slate-400 mb-2">Prizes</h3>
      <ul className="grid grid-cols-5 gap-2 text-sm">
        {entries.map(([place, amount]) => (
          <li key={place} className="flex items-center gap-2">
            <span className="rank-badge h-6 w-6 bg-amber-500/20 border border-amber-300/40 grid place-content-center text-amber-300 text-xs">
              {place
                .replace("st", "")
                .replace("nd", "")
                .replace("rd", "")
                .replace("th", "")}
            </span>
            <span className="text-slate-200">{formatCurrency(amount)}</span>
          </li>
        ))}
      </ul>
    </aside>
  );
}
