import { useEffect, useRef } from "react";

import { connectLiveWS } from "../lib/ws";
import type { WsMessage } from "../lib/types";

/**
 * Thin React wrapper around the imperative connector.
 * Keeps callback fresh via ref to avoid re-subscribing on every render.
 */
export function useWebSocket(onMessage: (m: WsMessage) => void) {
  const onMessageRef = useRef(onMessage);
  onMessageRef.current = onMessage;

  useEffect(() => {
    const ws = connectLiveWS({
      onMessage: (m) => onMessageRef.current(m),
    });
    return () => ws.close();
  }, []);
}
