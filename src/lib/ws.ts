import { WS_URL } from "../config";
import { parseWsMessage, type WsMessage } from "./types";

export type WsHandlers = {
  onMessage?: (msg: WsMessage) => void;
  onOpen?: () => void;
  onClose?: (ev: CloseEvent) => void;
  onError?: (ev: Event) => void;
};

function closeSilently(ws: WebSocket, code = 1000, reason = "normal-close") {
  try {
    ws.close(code, reason);
  } catch (err) {
    console.error("Error closing socket", err);
    return;
  }
}

/**
 * Imperative WS connector with reconnection + heartbeat.
 */
export function connectLiveWS(handlers: WsHandlers, token?: string) {
  const url = token ? `${WS_URL}?token=${encodeURIComponent(token)}` : WS_URL;

  let socket: WebSocket | null = null;
  let heartbeatId: number | null = null;
  let reconnectTimerId: number | null = null;
  let retries = 0;
  let shouldClose = false;

  const clearHeartbeat = () => {
    if (heartbeatId !== null) {
      window.clearInterval(heartbeatId);
      heartbeatId = null;
    }
  };

  const scheduleReconnect = () => {
    if (shouldClose) return;
    const backoff = Math.min(1000 * 2 ** retries, 15_000);
    if (reconnectTimerId !== null) {
      window.clearTimeout(reconnectTimerId);
    }
    reconnectTimerId = window.setTimeout(connect, backoff);
    retries += 1;
  };

  const connect = () => {
    const ws = new WebSocket(url);
    socket = ws;

    ws.onopen = () => {
      if (shouldClose) {
        closeSilently(ws, 1000, "cleanup-during-connecting");
        return;
      }
      retries = 0;
      heartbeatId = window.setInterval(() => {
        try {
          ws.send("ping");
        } catch (err) {
          console.error("Error sending ping", err);
          return;
        }
      }, 25_000);
      handlers.onOpen?.();
    };

    ws.onmessage = (ev) => {
      let json: unknown;
      try {
        json = JSON.parse(String(ev.data));
      } catch {
        return;
      }

      if (Array.isArray(json)) {
        for (const item of json) {
          const msg = parseWsMessage(item);
          if (msg) handlers.onMessage?.(msg);
        }
        return;
      }

      const msg = parseWsMessage(json);
      if (msg) handlers.onMessage?.(msg);
    };

    ws.onerror = (ev) => handlers.onError?.(ev);

    ws.onclose = (ev) => {
      clearHeartbeat();
      handlers.onClose?.(ev);
      scheduleReconnect();
    };
  };

  connect();

  return {
    close() {
      shouldClose = true;
      clearHeartbeat();

      const ws = socket;
      if (!ws) return;

      if (ws.readyState === WebSocket.OPEN) {
        closeSilently(ws, 1000, "component-unmount");
      }
    },
  };
}
