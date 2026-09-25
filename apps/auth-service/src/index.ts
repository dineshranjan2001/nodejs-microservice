import { config } from "dotenv";
import express from "express";
import { resolve } from "node:path";
import { AppError, errorHandler, httpLogger, logger, successHandler } from "shared";

// check .env inside the auth-service
config({
    path: resolve(process.cwd(), ".env")
});

// check .env the global or commonly shared or outside the auth-service
config({
    path: resolve(process.cwd(), "../../.env")
});

const PORT = process.env.AUTH_PORT || 30001;
const app = express();
app.use(httpLogger);
app.use(express.json());
app.get('/health', (_req, res) => {
    successHandler(res, 200, true, "Auth-service health is good.", { service: "auth-service" });
});

app.use((_req, _res, next) => {
    next(new AppError(404, "Route not found."))
});

app.use(errorHandler);
app.listen(PORT, () => {
    logger.info(`Auth service is now running on port ${PORT}`);
})