import express from "express";
import { config } from "dotenv";
import { resolve } from "node:path";
import { AppError, errorHandler, httpLogger, logger, requireGatewaySecret, successHandler } from "shared";
import taskRoutes from "./routes/task.route";
import { initKafka } from "./kafka";

const app = express();

config({ path: resolve(process.cwd(), ".env") });
config({ path: resolve(process.cwd(), "../../.env") });
app.use(express.json());

app.use(httpLogger);


app.use("/tasks", requireGatewaySecret, taskRoutes);

app.get("/health", (_req, res) => {
    successHandler(res, 200, true, "api-gateway health is good.", {
        service: "api-gateway",
    });
});

app.use((_req, _res, next) => {
    next(new AppError(404, "Route not found."));
});

app.use(errorHandler);

const TASK_PORT = process.env.TASK_PORT || 3002;

(async () => {
    try {
        await initKafka();
        app.listen(TASK_PORT, () => {
            logger.info(`Task service is now running on port ${TASK_PORT}`);
        });
    } catch (error) {
        logger.error({ error }, "Kafka Task Producer init failed.");
    }
})();

