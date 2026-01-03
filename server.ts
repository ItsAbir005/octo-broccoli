import express from "express";
import http from "http";
import { WebSocketServer } from "ws";

const app = express();
const server = http.createServer(app);

const wss = new WebSocketServer({ server, path: "/ws" });

app.get("/", (_, res) => {
  res.send("Server is running");
});

wss.on("connection", (ws) => {
  ws.send("Connected to WebSocket");
});

server.listen(8080, () => {
  console.log("Server started on port 8080");
});
