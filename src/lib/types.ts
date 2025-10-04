import { z } from "zod";

/**
 * Runtime schemas to "trust but verify" server payloads.
 * Why: server contracts may drift; runtime validation avoids silent UI corruption.
 */
export const TournamentSchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string().optional(),
  image: z.url(),
  status: z.enum(["upcoming", "ongoing", "finished"]).default("ongoing"),
  startDate: z.string(),
  endDate: z.string(),
  prizes: z.record(z.string(), z.number()),
  totalPrizePool: z.number(),
});
export type Tournament = z.infer<typeof TournamentSchema>;

export const LeaderboardEntrySchema = z.object({
  rank: z.number(),
  playerId: z.number(),
  username: z.string(),
  avatar: z.url(),
  totalBets: z.number(),
  betsCount: z.number().optional(),
  prize: z.number().optional(),
  lastBetTime: z.string().optional(),
});
export type LeaderboardEntry = z.infer<typeof LeaderboardEntrySchema>;

export const TournamentStatsSchema = z.object({
  totalBets: z.number(),
  totalVolume: z.number(),
  activePlayers: z.number(),
  averageBet: z.number(),
  topSports: z.record(z.string(), z.number()).optional(),
});
export type TournamentStats = z.infer<typeof TournamentStatsSchema>;

export const BetSchema = z.object({
  id: z.number(),
  playerId: z.number(),
  playerUsername: z.string(),
  playerAvatar: z.string().url().optional(),
  amount: z.number(),
  betType: z.string(),
  timestamp: z.string(),
  status: z.string().optional(),
});
export type Bet = z.infer<typeof BetSchema>;

/** --- WebSocket message contracts --- */
const WsBetPlacedSchema = z.object({
  type: z.literal("bet_placed"),
  bet: z.object({
    id: z.number(),
    playerId: z.number(),
    playerUsername: z.string(),
    playerAvatar: z.string().url().optional(),
    matchId: z.number().optional(),
    amount: z.number(),
    betType: z.string(),
    selection: z.string().optional(),
  }),
  timestamp: z.string(),
});

const WsLeaderboardUpdateSchema = z.object({
  type: z.literal("leaderboard_update"),
  tournamentId: z.number(),
  leaderboard: z.array(
    z.object({
      rank: z.number(),
      playerId: z.number(),
      username: z.string(),
      totalBets: z.number(),
      prize: z.number().optional(),
      avatar: z.url().optional(),
      betsCount: z.number().optional(),
      lastBetTime: z.string().optional(),
    })
  ),
  timestamp: z.string(),
});

const WsTournamentUpdateSchema = z.object({
  type: z.literal("tournament_update"),
  tournamentId: z.number().optional(),
  message: z.string().optional(),
  data: z.unknown().optional(),
  timestamp: z.string().optional(),
});

export type WsMessage =
  | z.infer<typeof WsBetPlacedSchema>
  | z.infer<typeof WsLeaderboardUpdateSchema>
  | z.infer<typeof WsTournamentUpdateSchema>;

/** ---- Normalizador seguro para WS ---- */
function toRecord(u: unknown): Record<string, unknown> | null {
  return u && typeof u === "object" ? (u as Record<string, unknown>) : null;
}

export function parseWsMessage(raw: unknown): WsMessage | null {
  const rec = toRecord(raw);
  if (!rec) return null;

  const kind = rec["type"] ?? rec["event"];
  if (typeof kind !== "string") return null;

  if (kind === "leaderboard_update") {
    const parsed = WsLeaderboardUpdateSchema.safeParse({
      ...rec,
      type: "leaderboard_update",
    });
    return parsed.success ? parsed.data : null;
  }
  if (kind === "bet_placed") {
    const parsed = WsBetPlacedSchema.safeParse({ ...rec, type: "bet_placed" });
    return parsed.success ? parsed.data : null;
  }
  if (kind === "tournament_update") {
    const parsed = WsTournamentUpdateSchema.safeParse({
      ...rec,
      type: "tournament_update",
    });
    return parsed.success ? parsed.data : null;
  }

  // Heartbeats/others: ignore silently
  return null;
}
