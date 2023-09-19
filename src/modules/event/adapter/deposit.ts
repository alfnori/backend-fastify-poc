import { HttpResponse } from '@common/types/http';
import EventService from '../service';
import { container } from 'tsyringe';
import { DepositOperationDTO } from '../types/dto';
import IEventAdapter from '.';
import logger from '@common/utils/logger';

class DepositEventAdapter implements IEventAdapter {
  readonly payload: DepositOperationDTO;
  readonly trackerId: string;

  constructor(payload: DepositOperationDTO, trackerId: string) {
    this.payload = payload;
    this.trackerId = trackerId;
  }

  async resolve(): Promise<HttpResponse> {
    const { payload, trackerId } = this;
    const service = container.resolve(EventService);
    const operation = await service.depositOperation(payload, trackerId);

    logger.info({ operation }, `DepositPerformed ${trackerId}`);
    return Promise.resolve({ statusCode: 201, success: true, data: operation });
  }
}

export default DepositEventAdapter;
