import type { Request, Response } from "express";
import { asyncHandler, getHeaderInfo, successHandler } from "shared";
import { createAttachmentService } from "../services/media.service";

export const createAttachmentController = asyncHandler(
  async (req: Request, res: Response) => {
    const { userId, userRole } = getHeaderInfo(req);
    const taskId = String(req.params.taskId);
    const createdAttachment = await createAttachmentService({
      taskId,
      uploadedBy: userId,
      userRole,
      file: req.file!,
    });
    
    successHandler(
      res,
      201,
      true,
      "Attachment created successfully.",
      createdAttachment,
    );
  },
);
