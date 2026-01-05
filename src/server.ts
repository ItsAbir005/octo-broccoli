import express from "express";
import http from "http";
import { WebSocketServer } from "ws";
import {Request,Response,NextFunction} from "express";
import globalErrorHandler from "./error/GlobalError";
import AppError from "./error/AppError";
import { requestLogger } from "./middleware/logger.middleware";
const app = express();
const server = http.createServer(app);

const wss = new WebSocketServer({ server, path: "/ws" });

app.get("/", (_, res) => {
  res.send("Server is running");
});

wss.on("connection", (ws) => {
  ws.send("Connected to WebSocket");
});
app.get("/error-test", (req, res, next) => {
  try {
    throw new Error("Test server failure");
  } catch (error) {
    next(error);
  }
});
app.use(requestLogger);
app.use(globalErrorHandler);
server.listen(8080, () => {
  console.log("Server started on port 8080",{url: "http://localhost:8080"});
});
