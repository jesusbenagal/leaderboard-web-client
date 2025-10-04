import { useQuery } from "@tanstack/react-query";

import { Api } from "../lib/api";

export function usePlayers() {
  return useQuery({
    queryKey: ["players"],
    queryFn: Api.players,
    staleTime: 60_000,
  });
}
