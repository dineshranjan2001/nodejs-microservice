import { Router } from "express";
import { createAttachmentController } from "../controller/media.controller";
import { uploadHandler } from "../middleware/media.middleware";

const attachmentRoutes=Router();

attachmentRoutes.post("/:taskId/attachments",uploadHandler,createAttachmentController);


export default attachmentRoutes;