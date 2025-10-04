import type { Tournament } from "../lib/types";
import { formatCurrency } from "../lib/format";

type Props = { tournament: Tournament };

export function PrizeLegend({ tournament }: Props) {
  const items = Object.entries(tournament.prizes ?? {})
    .map(([k, v]) => ({
      place: Number.parseInt(k, 10),
      amount: Number(v),
    }))
    .filter((x) => Number.isFinite(x.place) && Number.isFinite(x.amount))
    .sort((a, b) => a.place - b.place)
    .slice(0, 5);

  return (
    <section className="mt-4 rounded-2xl overflow-hidden border border-slate-800 bg-[#1a2029]">
      <header className="px-4 py-3 border-b border-slate-800 bg-[#1f2630]">
        <h3 className="text-slate-300 text-sm">Prizes</h3>
      </header>

      <div className="p-3 sm:p-4">
        {/* Grid that breathes on mobile and compacts progressively */}
        <ul
          role="list"
          className="
            grid grid-cols-2 gap-x-3 gap-y-2
            sm:grid-cols-3 sm:gap-x-4 sm:gap-y-3
            md:grid-cols-5 md:gap-x-5
          "
        >
          {items.map(({ place, amount }) => (
            <li
              key={place}
              className="flex items-center gap-2 sm:gap-2.5 md:gap-3"
            >
              {/* Rank badge (slightly smaller on mobile) */}
              <span
                className="
                  grid place-content-center rounded-md
                  h-6 w-6 text-[0.7rem]
                  sm:h-7 sm:w-7 sm:text-xs
                  bg-amber-500/25 border border-amber-300/40 text-amber-200
                "
                aria-label={`Place ${place}`}
                title={`Place ${place}`}
              >
                {place}
              </span>

              {/* Amount with responsive type + tabular numbers for alignment */}
              <span className="font-medium tabular-nums text-sm sm:text-base text-slate-100">
                {formatCurrency(amount)}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
