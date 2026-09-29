import express from "express";
import { config } from "dotenv";
import { resolve } from "node:path";
import { AppError, errorHandler, httpLogger, logger, successHandler } from "shared";

const app = express();

config({ path: resolve(process.cwd(), ".env") });
config({ path: resolve(process.cwd(), "../../.env") });

app.use(httpLogger);

app.get("/health", (_req, res) => {
    successHandler(res, 200, true, "api-gateway health is good.", {
        service: "api-gateway",
    });
});

app.use((_req, _res, next) => {
    next(new AppError(404, "Route not found."));
});
app.use(express.json());
app.use(errorHandler);

const TASK_PORT = process.env.TASK_PORT || 3002;

app.listen(TASK_PORT, () => {
    logger.info(`Task service is now running on port ${TASK_PORT}`)
});