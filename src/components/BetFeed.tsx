import { AnimatePresence, motion } from "framer-motion";

import { BetFeedItem } from "./BetFeedItem";

import type { Bet } from "../lib/types";

export function BetFeed({ bets }: { bets: Bet[] | undefined }) {
  return (
    <section className="rounded-2xl overflow-hidden border border-slate-800 bg-[#1a2029]">
      <header className="px-4 py-3 border-b border-slate-800 bg-[#1f2630]">
        <h3 className="text-sm text-slate-300">Live bets</h3>
      </header>

      <div className="p-2 lb-scroll">
        <motion.ul
          role="list"
          layout
          className="flex flex-col gap-2"
          initial="show"
          animate="show"
          variants={{
            show: {
              transition: { staggerChildren: 0.03, delayChildren: 0.02 },
            },
          }}
        >
          <AnimatePresence initial={false}>
            {bets?.map((bet) => (
              <BetFeedItem key={bet.id} bet={bet} />
            ))}
          </AnimatePresence>
        </motion.ul>
      </div>
    </section>
  );
}
