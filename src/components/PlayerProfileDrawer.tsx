import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

import { ProfileStat } from "./ProfileStat";
import { BetRow } from "./BetRow";

import { usePlayerById } from "../hooks/usePlayerById";
import { usePlayerBets } from "../hooks/usePlayerBets";

import { formatCurrency } from "../lib/format";

type Props = {
  playerId: number | null;
  tournamentId: number;
  onClose: () => void;
};

export function PlayerProfileDrawer({
  playerId,
  tournamentId,
  onClose,
}: Props) {
  const playerQ = usePlayerById(playerId);
  const betsQ = usePlayerBets(tournamentId, playerId, 50);

  // Close on ESC
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const open = !!playerId;

  const p = playerQ.data;
  const avatar =
    p?.avatar ??
    (p ? `https://api.dicebear.com/7.x/avataaars/svg?seed=${p.id}` : undefined);

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-[2px] z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            aria-hidden
          />

          {/* Drawer panel */}
          <motion.aside
            className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-[#0f141b] border-l border-slate-800 shadow-2xl flex flex-col"
            role="dialog"
            aria-modal="true"
            aria-label="Player profile"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.22 }}
          >
            {/* Header */}
            <div className="p-4 border-b border-slate-800 flex items-center gap-3">
              {avatar && (
                <img
                  src={avatar}
                  alt={p?.username ?? "player"}
                  className="h-12 w-12 rounded-full border border-slate-700 bg-slate-800"
                />
              )}
              <div className="min-w-0">
                <h3 className="font-semibold text-white truncate">
                  {p?.username ?? "Loading player…"}
                </h3>
                <p className="text-xs text-slate-400">
                  {p?.favoritesSport
                    ? `Fav sport: ${p.favoritesSport}`
                    : "\u00A0"}
                </p>
              </div>
              <button
                onClick={onClose}
                className="ml-auto rounded-md border border-slate-700 px-2 py-1 text-slate-200 hover:bg-slate-800"
                aria-label="Close"
              >
                ✕
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-3 p-4 text-sm">
              <ProfileStat label="Total bets" value={p?.betsCount ?? 0} />
              <ProfileStat
                label="Volume"
                value={formatCurrency(p?.totalBets ?? 0)}
              />
              <ProfileStat
                label="Avg bet"
                value={formatCurrency(
                  (p?.totalBets ?? 0) / Math.max(1, p?.betsCount ?? 1)
                )}
              />
            </div>

            {/* Bets list */}
            <div className="px-4 pb-4 flex-1 overflow-auto">
              <h4 className="text-slate-300 text-sm mb-2">Recent bets</h4>
              <ul className="flex flex-col gap-2" role="list">
                {(betsQ.data ?? []).map((b) => (
                  <BetRow key={b.id} bet={b} />
                ))}
                {!betsQ.data?.length && (
                  <li className="text-sm text-slate-500 py-6 text-center">
                    No bets for this player in this tournament yet.
                  </li>
                )}
              </ul>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
