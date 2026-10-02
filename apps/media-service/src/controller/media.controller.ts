import type { Request, Response } from "express";
import { asyncHandler, getHeaderInfo, successHandler } from "shared";
import {
  createAttachmentService,
  getAttachmentDetailsByIdService,
  getListAttachmentsByTaskIdService,
} from "../services/media.service";

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

export const getListAttachmentsByTaskIdController = asyncHandler(
  async (req: Request, res: Response) => {
    const taskId = String(req.params.taskId);
    const { userId, userRole } = getHeaderInfo(req);
    const getListAttachments = await getListAttachmentsByTaskIdService(
      taskId,
      userId,
      userRole,
    );
    successHandler(
      res,
      200,
      true,
      "List of attachments fetched successfully",
      getListAttachments,
    );
  },
);

export const getAttachmentDetailsByIdController = asyncHandler(
  async (req: Request, res: Response) => {
    const taskId = String(req.params.taskId);
    const attachmentId = String(req.params.attachmentId);
    const { userId, userRole } = getHeaderInfo(req);
    const getAttachmentDetails = await getAttachmentDetailsByIdService(
      taskId,
      attachmentId,
      userId,
      userRole,
    );
    successHandler(
      res,
      200,
      true,
      "Attachments fetched successfully",
      getAttachmentDetails,
    );
  },
);


