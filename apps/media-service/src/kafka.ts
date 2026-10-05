import { createProducer, publishJsonsafe, TOPICS } from "shared";


let producer: Awaited<ReturnType<typeof createProducer>> | null = null;

export async function initKafka() {
    producer = await createProducer("media-service");
}

export async function publishAttachmentEvent(attachmentId: string, taskId: string, userId: string) {
    await publishJsonsafe(
        producer,
        TOPICS.MEDIA_EVENTS,
        {
            eventType: "attachments.created",
            attachmentId,
            taskId,
            userId,
            message: "Attachment is uploaded",
            timestamp: new Date().toISOString()
        }
    )
}