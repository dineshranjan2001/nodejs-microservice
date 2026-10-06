import express from "express";
import { config } from "dotenv";
import { resolve } from "node:path"
import { AppError, errorHandler, httpLogger, logger, requireGatewaySecret, successHandler } from "shared";
import { startKafka } from "./services/workflow.service";
import taskWorkflowApis from "./routes/workflow.routes";



config({ path: resolve(process.cwd(), ".env") });
config({ path: resolve(process.cwd(), "../../.env") });

const app = express();


app.use(express.json());
app.use(httpLogger);

app.use('/tasks', requireGatewaySecret, taskWorkflowApis);

app.get("/health", (_req, res) => {
    successHandler(res, 200, true, "workflow service health is good.", {
        service: "workflow-service",
    });
});

app.use((_req, _res, next) => {
    next(new AppError(404, "Route not found."));
});


app.use(errorHandler);

const WORKFLOW_PORT = process.env.WORKFLOW_PORT || "3004";

(async () => {
    try {
        await startKafka();

        app.listen(WORKFLOW_PORT, () => {
            logger.info(`Workflow service is now running on port ${WORKFLOW_PORT}`);
        })
    } catch (error) {
        logger.error({ error }, "Kafka Consumer init failed.");
    }

})();

