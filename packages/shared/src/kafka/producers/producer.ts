import type { Producer } from "kafkajs";
import { createKafkaClient } from "../config/client";
import { logger } from "../../logger/logger";

export async function createProducer(clientId: string): Promise<Producer> {
    const kafka = createKafkaClient(clientId);
    const producer = kafka.producer();
    await producer.connect();
    logger.info({ clientId }, "kafka producer connected.");
    return producer;
}

export async function publishJsonsafe(
    producer: Producer | null,
    topic: string,
    payload: Record<string, unknown>,
    key?: string
): Promise<void> {
    if (!producer) {
        logger.warn({ topic }, "Kafka producer is not ready");
        return;
    }
    try {
        await producer.send({
            topic,
            messages: [
                {
                    key: key ?? null,
                    value: JSON.stringify(payload)
                }
            ]
        });
        logger.info({ topic, payload }, "Kafka event published");
    } catch (error) {
        logger.error({ error, topic }, "Kafka published failed");
    }
}