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
  leaderboard: z.array(LeaderboardEntrySchema),
  timestamp: z.string(),
});

export const WsMessageSchema = z.discriminatedUnion("type", [
  WsBetPlacedSchema,
  WsLeaderboardUpdateSchema,
]);
export type WsMessage = z.infer<typeof WsMessageSchema>;
