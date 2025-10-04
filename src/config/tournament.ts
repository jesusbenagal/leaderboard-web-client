/**
 * Tournament configuration constants
 */
export const TOURNAMENT_CONFIG = {
  ACTIVE_TOURNAMENT_ID: 101,
} as const;

export type TournamentConfig = typeof TOURNAMENT_CONFIG;
