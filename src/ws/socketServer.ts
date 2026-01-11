import { WebSocketServer } from "ws";
import http from "http";
import url from "url";
import { logger } from "../middleware/logger.middleware";
import { verifyWsToken } from "./wsAuth";
const clients = new Map<string, any>();
export const initWebSocket = (server: http.Server) => {
  const wss = new WebSocketServer({ server });
  wss.on("connection", (ws, req) => {
    try {
      const parsed = url.parse(req.url || "", true);
      const token = parsed.query.token as string;
      const payload = verifyWsToken(token);
      clients.set(payload.id, ws);
      logger.info(`WS client authenticated: userId=${payload.id}`);

      ws.send(JSON.stringify({
        type: "AUTH_SUCCESS",
        userId: payload.id,
      }));
      ws.on("close", () => {
        clients.delete(payload.id);
        logger.warn(`WS client disconnected: userId=${payload.id}`);
      });
    } catch (err: any) {
      ws.send(JSON.stringify({
        type: "AUTH_FAILED",
        message: err.message,
      }));
      ws.close();
    }
  });
};

export { clients };
