import type { Attachments } from "../types/media.type";

export function convertToCommonAttachmentResponse(attachment: Attachments) {
  return {
    id: attachment.id,
    taskId: attachment.task_id,
    imageUrl: attachment.image_url,
    publicId: attachment.public_id,
    uploadedBy: attachment.uploaded_by,
    createdAt: attachment.created_at,
  };
}
