import { HttpResponse } from '@common/types/http';
import EventService from '../service';
import { container } from 'tsyringe';
import { TransferOperationDTO } from '../types/dto';
import IEventAdapter from '.';
import logger from '@common/utils/logger';
import AppError from '@common/errors/AppError';

export class TransferEventAdapter implements IEventAdapter {
  readonly payload: TransferOperationDTO;
  readonly trackerId: string;

  constructor(payload: TransferOperationDTO, trackerId: string) {
    this.payload = payload;
    this.trackerId = trackerId;
  }

  async resolve(): Promise<HttpResponse> {
    const { trackerId, payload } = this;
    const service = container.resolve(EventService);

    let statusCode, data, details, success;

    try {
      const operation = await service.transferOperation(payload, trackerId);
      logger.info({ operation }, `TransferPerformed ${trackerId}`);

      statusCode = 201;
      data = operation;
      success = true;
    } catch (error) {
      const responseError = (error as AppError).toResponseError();
      logger.error({ error, responseError }, 'Transfer AppError raised!');

      statusCode = 404;
      details = 0;
      success = false;
    } finally {
      return { statusCode, success, data, details };
    }
  }
}
