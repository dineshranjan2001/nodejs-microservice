import { AppError, createConsumer, logger, runConsumer, TOPICS } from "shared";
import type { DomainEvent } from "../types/workflow.type";
import { createTaskWorkflows, findTaskById, getListWorkflowsByTaskId } from "../repository/workflow.repository";
import { convertToCommonTaskWorkflowsResponse } from "../utils/workflow.utils";


export async function handleDomainEvent(domainEvent: DomainEvent) {
    if (!domainEvent.eventType || !domainEvent.taskId || !domainEvent.userId) {
        logger.warn({ domainEvent }, "invalid domain event");
        return;
    }

    const createdTaskWorkFlow = await createTaskWorkflows({
        taskId: domainEvent.taskId,
        eventType: domainEvent.eventType,
        message: domainEvent.message || domainEvent.eventType,
        createdBy: domainEvent.userId
    });

    logger.info({
        workflowId: createdTaskWorkFlow.id,
        eventType: createdTaskWorkFlow.event_type,
    }, "workflow row created");

    return convertToCommonTaskWorkflowsResponse(createdTaskWorkFlow);


}

export async function startKafka() {
    const consumer = await createConsumer("workflow-service", "workflow-service-group");

    // run the consumer

    await runConsumer(
        consumer,
        [TOPICS.TASK_EVENTS, TOPICS.MEDIA_EVENTS],
        async ({ message }) => {
            const value = message?.value?.toString();
            if (!value) return;

            await handleDomainEvent(JSON.parse(value) as DomainEvent);
        }
    )
}

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

export async function getListOfWorkflowsService(userId: string, userRole: string, taskId: string) {
    await assertTaskAccess(taskId, userId, userRole);
    const getListOfWorkflows = await getListWorkflowsByTaskId(taskId);
    return getListOfWorkflows.map((workflow) => convertToCommonTaskWorkflowsResponse(workflow));

}