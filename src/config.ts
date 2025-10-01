// Centralized runtime config with safe fallbacks.
export const API_URL: string =
  import.meta.env.VITE_API_BASE_URL ?? "http://localhost:4000";
export const WS_URL: string =
  import.meta.env.VITE_WS_URL ?? "ws://localhost:4000";
