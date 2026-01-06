import express from "express";
import http from "http";
import cors from "cors";
import cookieParser from "cookie-parser";
import { WebSocketServer } from "ws";
import {Request,Response,NextFunction} from "express";
import globalErrorHandler from "./error/GlobalError";
import AppError from "./error/AppError";
import { requestLogger } from "./middleware/logger.middleware";
import { asyncWrapper } from "./middleware/asyncWarpper";
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from "./auth/refreshTokenService";
const app = express();
app.use(cors());
app.use(cookieParser());
app.use(express.json());
app.use(requestLogger);
const server = http.createServer(app);
const wss = new WebSocketServer({ server, path: "/ws" });
wss.on("connection", (ws) => {
  ws.send("Connected to WebSocket");
});
app.get("/error", asyncWrapper(async (req: Request, res: Response, next: NextFunction) => {
  throw new AppError("This is a test error", 500);
}));
server.listen(8080, () => {
  console.log("Server started on port 8080",{url: "http://localhost:8080"});
});
app.use(globalErrorHandler);
