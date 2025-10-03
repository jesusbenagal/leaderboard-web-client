import { WS_URL } from "../config";

import { WsMessageSchema, type WsMessage } from "./types";

export type WsHandlers = {
  onMessage?: (msg: WsMessage) => void;
  onOpen?: () => void;
  onClose?: (ev: CloseEvent) => void;
  onError?: (ev: Event) => void;
};

/**
 * Imperative WS connector with reconnection + heartbeat.
 */
export function connectLiveWS(handlers: WsHandlers, token?: string) {
  const url = token ? `${WS_URL}?token=${encodeURIComponent(token)}` : WS_URL;
  let socket: WebSocket | null = null;
  let retries = 0;
  let closedByUser = false;
  let heartbeat: number | undefined;

  const connect = () => {
    socket = new WebSocket(url);

    socket.onopen = () => {
      retries = 0;
      heartbeat = window.setInterval(() => socket?.send?.("ping"), 25_000); // keep-alive for proxies (25 seconds)
      handlers.onOpen?.();
    };

    socket.onclose = (ev) => {
      window.clearInterval(heartbeat);
      handlers.onClose?.(ev);
      if (!closedByUser) {
        const backoff = Math.min(1000 * 2 ** retries, 15_000);
        retries += 1;
        window.setTimeout(connect, backoff);
      }
    };

    socket.onerror = (ev) => handlers.onError?.(ev);

    socket.onmessage = (ev) => {
      try {
        const raw = JSON.parse(ev.data as string);
        const parsed = WsMessageSchema.parse(raw); // runtime validation with Zod
        handlers.onMessage?.(parsed);
      } catch (e) {
        console.warn("WS invalid payload", e);
      }
    };
  };

  connect();

  return {
    close() {
      closedByUser = true;
      window.clearInterval(heartbeat);
      socket?.close();
    },
  };
}
