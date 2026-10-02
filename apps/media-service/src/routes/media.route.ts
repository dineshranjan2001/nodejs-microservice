import { Router } from "express";
import { createAttachmentController, getAttachmentDetailsByIdController, getListAttachmentsByTaskIdController } from "../controller/media.controller";
import { uploadHandler } from "../middleware/media.middleware";

const attachmentRoutes=Router();

attachmentRoutes.post("/:taskId/attachments",uploadHandler,createAttachmentController);
attachmentRoutes.get('/:taskId/attachments',getListAttachmentsByTaskIdController);
attachmentRoutes.get('/:taskId/attachments/:attachmentId',getAttachmentDetailsByIdController);

export default attachmentRoutes;