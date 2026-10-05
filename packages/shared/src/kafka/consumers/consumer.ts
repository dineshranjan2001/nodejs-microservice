import type { Consumer } from "kafkajs";
import { createKafkaClient } from "../config/client";
import { logger } from "../../logger/logger";

export async function createConsumer(clientId: string, groupId: string): Promise<Consumer> {

    const kafka = createKafkaClient(clientId);
    const consumer = kafka.consumer({ groupId });
    await consumer.connect();
    logger.info({ clientId, groupId }, "kafka consumer is connected");
    return consumer;


}