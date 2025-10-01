import { z } from "zod";

import { API_URL } from "../config";

import {
  LeaderboardEntrySchema,
  TournamentSchema,
  TournamentStatsSchema,
  type LeaderboardEntry,
  type Tournament,
  type TournamentStats,
} from "./types";

/**
 * Small typed fetch wrapper with Zod runtime validation.
 *  - Throw explicit errors on HTTP non-200.
 *  - Parse JSON safely.
 *  - Validate payloads to catch contract drift early.
 */
async function getJSON<T>(path: string, schema: z.ZodType<T>): Promise<T> {
  const res = await fetch(`${API_URL}${path}`);
  if (!res.ok) throw new Error(`HTTP error! status: ${res.status} for ${path}`);

  const data = await res.json();

  const parsed = schema.safeParse(data);
  if (!parsed.success) {
    console.error(
      "[API] Schema validation failed:",
      z.treeifyError(parsed.error)
    );
    throw new Error("Schema validation failed");
  }
  return parsed.data;
}

export const Api = {
  /** List active tournaments */
  tournaments: () =>
    getJSON<Tournament[]>(`/api/tournaments`, z.array(TournamentSchema)),

  /** Tournament leaderboard */
  leaderboard: (tournamentId: number, limit = 50) =>
    getJSON<LeaderboardEntry[]>(
      `/api/leaderboard/${tournamentId}?limit=${limit}`,
      z.array(LeaderboardEntrySchema)
    ),

  /** Tournament stats */
  stats: (tournamentId: number) =>
    getJSON<TournamentStats>(
      `/api/tournaments/${tournamentId}/stats`,
      TournamentStatsSchema
    ),
};
