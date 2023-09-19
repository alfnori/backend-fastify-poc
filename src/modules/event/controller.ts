import { HttpErrorResponse, HttpSuccessResponse } from '@common/types/http';
import logger from '@common/utils/logger';
import { FastifyReply, FastifyRequest } from 'fastify';

import EventAdapterFactory from './factory';
import { EventOperationDTO } from './types/dto';

type EventRequest = FastifyRequest<{
  Body: EventOperationDTO;
}>;

class EventController {
  public async operationFacade(req: EventRequest, reply: FastifyReply): Promise<FastifyReply> {
    const event = req.body;
    const trackerId = req.id;
    const type = { event };

    const adapter = EventAdapterFactory.build(event, trackerId);
    const operation = await adapter.resolve();

    if (!operation.success) {
      const errorOperation = operation as HttpErrorResponse;
      logger.error({ event, operation: errorOperation.details }, `EventPerformed ${type}`);
      return reply.code(errorOperation.statusCode).send(errorOperation.details);
    }

    const successOperation = operation as HttpSuccessResponse;
    logger.info({ event, operation: successOperation.data }, `EventPerformed ${type}`);
    return reply.code(successOperation.statusCode).send(successOperation.data);
  }
}

export default EventController;
