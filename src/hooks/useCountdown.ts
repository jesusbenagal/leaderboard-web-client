// Simple ticking countdown with a stable, memoized breakdown.
// Why: keeps re-render noise low; easy to test.
import { useMemo, useState, useEffect } from "react";

export const useCountdown = (isoEnd: string) => {
  const [ms, setMs] = useState(() => new Date(isoEnd).getTime() - Date.now());

  useEffect(() => {
    const id = window.setInterval(() => {
      setMs(new Date(isoEnd).getTime() - Date.now());
    }, 1000);
    return () => window.clearInterval(id);
  }, [isoEnd]);

  const remaining = Math.max(ms, 0);
  const days = Math.floor(remaining / 86_400_000);
  const hours = Math.floor((remaining % 86_400_000) / 3_600_000);
  const minutes = Math.floor((remaining % 3_600_000) / 60_000);
  const seconds = Math.floor((remaining % 60_000) / 1000);
  const ended = remaining <= 0;

  return useMemo(
    () => ({ days, hours, minutes, seconds, ended }),
    [days, hours, minutes, seconds, ended]
  );
};
