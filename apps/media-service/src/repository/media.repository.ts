import { getPool } from "shared";
import type { AttachmentInput, Attachments } from "../types/media.type";

export async function createAttachment(
  attachmentDetails: AttachmentInput,
): Promise<Attachments> {
  const result = await getPool().query<Attachments>(
    `
            INSERT INTO attachments(task_id,image_url,public_id,uploaded_by) VALUES($1,$2,$3,$4)
            RETURNING id,task_id,image_url,public_id,uploaded_by,created_at;
        `,
    [
      attachmentDetails.taskId,
      attachmentDetails.imageUrl,
      attachmentDetails.publicId,
      attachmentDetails.uploadedBy,
    ],
  );
  return result.rows[0]!;
}

export async function findTaskById(
  taskId: string,
): Promise<{ id: string; created_by: string } | null> {
  const result = await getPool().query<{ id: string; created_by: string }>(
    `
            SELECT id,created_by FROM tasks WHERE id=$1
        `,
    [taskId],
  );

  return result.rows[0] ?? null;
}
