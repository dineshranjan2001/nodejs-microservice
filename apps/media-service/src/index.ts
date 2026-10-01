import { config } from "dotenv";
import express from "express";
import { resolve } from "node:path";
import { AppError, errorHandler, httpLogger, logger, successHandler } from "shared";

config({path:resolve(process.cwd(),".env")});
config({path:resolve(process.cwd(),"../../.env")});

const app=express();
const MEDIA_PORT=process.env.MEDIA_PORT|| "3003";

app.use(httpLogger);


app.get("/health", (_req, res) => {
    successHandler(res, 200, true, "media-service health is good.", {
        service: "media-service",
    });
});


app.use((_req, _res, next) => {
    next(new AppError(404, "Route not found."));
});


app.use(errorHandler);

app.listen(MEDIA_PORT,()=>{
    logger.info(`Media service is now running on port ${MEDIA_PORT}`);
});