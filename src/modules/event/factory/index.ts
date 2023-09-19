import IControllerAdapter, { Params } from '@common/interfaces/controllerAdapters';
import { EventOperationDTO } from '../types/dto';
import { EventType } from '@common/types/account';
import DepositEventAdapter from '../adapter/deposit';
import { WithdrawEventAdapter } from '../adapter/withdraw';
import { TransferEventAdapter } from '../adapter/transfer';
import raiseAppError from '@common/errors/raise';
import { AppErrorType } from '@common/errors/types';
import IEventAdapter from '../adapter';

export type OperationEventHandler = {
  adapter: IControllerAdapter;
  payload: Params;
};

export default class EventAdapterFactory {
  static build(event: EventOperationDTO, trackerId: string): IEventAdapter {
    const { type, amount, destination, origin } = event;

    switch (type) {
      case EventType.DEPOSIT:
        return new DepositEventAdapter({ destination, amount }, trackerId);
      case EventType.WITHDRAW:
        return new WithdrawEventAdapter({ origin, amount }, trackerId);
      case EventType.TRANSFER:
        return new TransferEventAdapter({ origin, destination, amount }, trackerId);
      default:
        throw raiseAppError(AppErrorType.INVALID_EVENT_TYPE);
    }
  }
}
