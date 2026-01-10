import { WebSocketServer } from "ws";
import http from "http";
import { logger } from "../middleware/logger.middleware";
export const initWebSocket = (server: http.Server) => {
  const wss = new WebSocketServer({ server });
  wss.on("connection", (ws) => {
    logger.info("WebSocket client connected");
    ws.send(JSON.stringify({
      type: "CONNECTED",
      message: "WebSocket connection established",
    }));
    ws.on("close", () => {
      logger.warn("WebSocket client disconnected");
    });
  });
};
