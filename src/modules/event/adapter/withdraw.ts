import { HttpResponse } from '@common/types/http';
import EventService from '../service';
import { container } from 'tsyringe';
import { WithdrawOperationDTO } from '../types/dto';
import IEventAdapter from '.';
import logger from '@common/utils/logger';
import AppError from '@common/errors/AppError';

export class WithdrawEventAdapter implements IEventAdapter {
  readonly payload: WithdrawOperationDTO;
  readonly trackerId: string;

  constructor(payload: WithdrawOperationDTO, trackerId: string) {
    this.payload = payload;
    this.trackerId = trackerId;
  }

  async resolve(): Promise<HttpResponse> {
    const { trackerId, payload } = this;
    const service = container.resolve(EventService);

    let statusCode, data, details, success;

    try {
      const operation = await service.withdrawOperation(payload, trackerId);
      logger.info({ operation }, `WithdrawPerformed ${trackerId}`);

      statusCode = 201;
      data = operation;
      success = true;
    } catch (error) {
      const responseError = (error as AppError).toResponseError();
      logger.error({ error, responseError }, 'Withdraw AppError raised!');

      statusCode = 404;
      details = 0;
      success = false;
    } finally {
      return { statusCode, data, details, success };
    }
  }
}
