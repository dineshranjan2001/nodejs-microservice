import { config } from "dotenv";
import { resolve } from "node:path";
import express from "express";
import { AppError, errorHandler, httpLogger, logger, successHandler } from "shared";
import helmet from "helmet";
import cors from "cors";
import rateLimit from "express-rate-limit";
import { createProxyMiddleware } from "http-proxy-middleware";

config({ path: resolve(process.cwd(), ".env") });
config({ path: resolve(process.cwd(), "../../.env") });

const PORT = process.env.GATEWAY_PORT;
const AUTH_SERVICE_URL =
  process.env.AUTH_SERVICE_URL || "http://localhost:3001";

const app = express();

console.log(process.env.AUTH_SERVICE_URL);

//secure default http headers
app.use(helmet());

// for the cors origin allow
app.use(cors());

//rate limiting for the request per user and per 15 minutes
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
    standardHeaders: true, // draft-6: `RateLimit-*` headers; draft-7 & draft-8: combined `RateLimit` header
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
  }),
);

app.use(httpLogger);

app.get("/health", (_req, res) => {
  successHandler(res, 200, true, "api-gateway health is good.", {
    service: "api-gateway",
  });
});

//proxy configuration
app.use(
  "/auth",
  createProxyMiddleware({
    target: AUTH_SERVICE_URL,
    changeOrigin: true,
    pathRewrite: (path) => `/auth${path}`,
  }),
);

app.use((_req, _res, next) => {
  next(new AppError(404, "Route not found."));
});

app.use(errorHandler);

app.listen(PORT, () => {
  logger.info(`Api Gateway is now running on port ${PORT}`);
});
