import express from "express";
import http from "http";
import dotenv from "dotenv";
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
dotenv.config();
const server = http.createServer(app);
const wss = new WebSocketServer({ server, path: "/ws" });
let validRefreshTokens = new Set<string>(); 
wss.on("connection", (ws) => {
  ws.send("Connected to WebSocket");
});
app.get("/error", asyncWrapper(async (req: Request, res: Response, next: NextFunction) => {
  throw new AppError("This is a test error", 500);
}));
app.post("/refresh", asyncWrapper(async (req, res) => {
  const { token } = req.body;
  if (!token || !validRefreshTokens.has(token)) {
    throw new AppError("Refresh token reuse or not recognized", 403);
  }
  const payload = verifyRefreshToken(token);
  const newAccess = generateAccessToken(payload.id);
  const newRefresh = generateRefreshToken(payload.id);

  validRefreshTokens.delete(token);
  validRefreshTokens.add(newRefresh);

  res.json({ accessToken: newAccess, refreshToken: newRefresh });
}));
app.post("/temp-login", (req, res) => {
  const access = generateAccessToken("19");
  const refresh = generateRefreshToken("19");
  validRefreshTokens.add(refresh);
  res.json({ access, refresh });
});
server.listen(8080, () => {
  console.log("Server started on port 8080",{url: "http://localhost:8080"});
});
app.use(globalErrorHandler);
