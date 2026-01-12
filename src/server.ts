import express from "express";
import http from "http";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import { Request, Response, NextFunction } from "express";
import globalErrorHandler from "./error/GlobalError";
import AppError from "./error/AppError";
import { requestLogger, logger } from "./middleware/logger.middleware";
import { asyncWrapper } from "./middleware/asyncWarpper";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "./auth/refreshTokenService";
import {
  deleteRefreshToken,
  saveRefreshToken,
  getUserIdFromRefresh,
} from "./service/redisTokenService";
import { StatusCode } from "./constants/statusCodes";
import { apiSuccess } from "./utils/apiResponse";
import { requestId } from "./middleware/requestId";
import { compress } from "./middleware/compressionMiddleware";
import { validate } from "./middleware/validate";
import { testSchema } from "./validation/testSchema";
import { authRateLimiter } from "./middleware/rateLimiter";
import { healthCheck, readinessCheck } from "./health/healthController";
import { initWebSocket } from "./ws/socketServer";
import "./queue/redisSubscriber";
import { notifyUser } from "./controllers/notifyController";
dotenv.config();
const app = express();
app.use(helmet());
app.use(cors());
app.use(cookieParser());
app.use(express.json());
app.use(requestId);
app.use(requestLogger);
app.use(compress);
const server = http.createServer(app);
initWebSocket(server);
app.get("/health", healthCheck);
app.get("/readiness", readinessCheck);
app.get(
  "/error",
  asyncWrapper(async (req: Request, res: Response, next: NextFunction) => {
    throw new AppError("This is a test error", 500);
  })
);
app.post(
  "/refresh",
  authRateLimiter,
  asyncWrapper(async (req, res) => {
    const { token } = req.body;
    if (!token) {
      throw new AppError("Refresh token required", 400);
    }

    const userId = await getUserIdFromRefresh(token);
    if (!userId) {
      throw new AppError("Refresh token reuse or not recognized", 403);
    }

    const payload = verifyRefreshToken(token);
    const newAccess = generateAccessToken(payload.id);
    const newRefresh = generateRefreshToken(payload.id);

    await deleteRefreshToken(token);
    await saveRefreshToken(newRefresh, payload.id);

    res.json({ accessToken: newAccess, refreshToken: newRefresh });
  })
);

app.post(
  "/temp-login",
  authRateLimiter,
  asyncWrapper(async (req, res) => {
    const access = generateAccessToken("19");
    const refresh = generateRefreshToken("19");
    await saveRefreshToken(refresh, "19");
    res.json({ access, refresh });
  })
);

app.post(
  "/logout",
  asyncWrapper(async (req, res) => {
    const { token } = req.body;
    if (!token) throw new AppError("Refresh token required", 400);
    await deleteRefreshToken(token);
    res.json({ success: true, message: "Logged out safely" });
  })
);
app.get("/status-test", (req, res) => {
  apiSuccess(res, { service: "running" }, "Service is healthy", StatusCode.OK);
});

app.post("/zod-test", validate(testSchema), (req, res) => {
  res.json({ success: true, data: req.body });
});
app.post("/notify", asyncWrapper(notifyUser));
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: "Route not found",
    path: req.path,
  });
});
app.use(globalErrorHandler);
const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
  logger.info(`Server started on port ${PORT}`);
  console.log(`Server URL: http://localhost:${PORT}`);
});