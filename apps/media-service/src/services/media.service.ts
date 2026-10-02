import { AppError } from "shared";
import {
  createAttachment,
  findAttachmentsByTaskId,
  findListAttachmentsByTaskId,
  findTaskById,
} from "../repository/media.repository";
import { uploadBuffer } from "../utils/storage.utils";
import { convertToCommonAttachmentResponse } from "../utils/media.utils";

export async function assertTaskAccess(
  taskId: string,
  userId: string,
  userRole: string,
): Promise<void> {
  const getTaskDetails = await findTaskById(taskId);
  if (!getTaskDetails) {
    throw new AppError(404, "Task not found");
  }
  if (getTaskDetails.created_by !== userId && userRole !== "ADMIN") {
    throw new AppError(403, "Forbidden");
  }
}

export async function createAttachmentService(attachmentData: {
  taskId: string;
  uploadedBy: string;
  userRole: string;
  file?: Express.Multer.File;
}) {
  if (!attachmentData.file) {
    throw new AppError(400, "Image file is required!");
  }

  await assertTaskAccess(
    attachmentData.taskId,
    attachmentData.uploadedBy,
    attachmentData.userRole,
  );

  const uploaded = await uploadBuffer(
    attachmentData.file.buffer,
    attachmentData.file.mimetype || "image/jpeg",
  );
  const createdAttachment = await createAttachment({
    taskId: attachmentData.taskId,
    imageUrl: uploaded.imageUrl,
    publicId: uploaded.publicId,
    uploadedBy: attachmentData.uploadedBy,
  });
  return convertToCommonAttachmentResponse(createdAttachment);
}

export async function getListAttachmentsByTaskIdService(
  taskId: string,
  userId: string,
  userRole: string,
) {
  await assertTaskAccess(taskId, userId, userRole);
  const getListAttachments = await findListAttachmentsByTaskId(taskId);
  return getListAttachments.map((attachment) =>
    convertToCommonAttachmentResponse(attachment),
  );
}

export async function getAttachmentDetailsByIdService(
  taskId: string,
  attachmentId: string,
  userId: string,
  userRole: string,
) {
  await assertTaskAccess(taskId, userId, userRole);
  const getAttachmentDetails = await findAttachmentsByTaskId(attachmentId);
  if (!getAttachmentDetails) {
    throw new AppError(404, "Attachment not found");
  }

  return convertToCommonAttachmentResponse(getAttachmentDetails);
}
