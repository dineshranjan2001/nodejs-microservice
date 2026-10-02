import { AppError } from "shared";
import { createAttachment, findTaskById } from "../repository/media.repository";
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
