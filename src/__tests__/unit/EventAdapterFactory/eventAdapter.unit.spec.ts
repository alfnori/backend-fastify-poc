import raiseAppError from '@common/errors/raise';
import { AppErrorType } from '@common/errors/types';
import { EventType } from '@common/types/account';
import DepositEventAdapter from '@modules/event/adapter/deposit';
import { TransferEventAdapter } from '@modules/event/adapter/transfer';
import { WithdrawEventAdapter } from '@modules/event/adapter/withdraw';
import EventAdapterFactory from '@modules/event/factory';
import { EventOperationDTO } from '@modules/event/types/dto';
import { assert, expect } from 'chai';

describe('Unit tests for Event Adapter Factory', async () => {
  it('should return a deposit event adapter', async () => {
    const event: EventOperationDTO = { origin: '', destination: '123', amount: 10, type: EventType.DEPOSIT };
    const adapter = EventAdapterFactory.build(event, 'deposit-1');
    assert.instanceOf(adapter, DepositEventAdapter);
    assert.equal(adapter.payload.destination, '123');
  });

  it('should return a withdraw event adapter', async () => {
    const event: EventOperationDTO = { origin: '321', destination: '', amount: 10, type: EventType.WITHDRAW };
    const adapter = EventAdapterFactory.build(event, 'withdraw-1');
    assert.instanceOf(adapter, WithdrawEventAdapter);
    assert.equal(adapter.payload.origin, '321');
  });

  it('should return a transfer event adapter', async () => {
    const event: EventOperationDTO = { origin: '321', destination: '123', amount: 10, type: EventType.TRANSFER };
    const adapter = EventAdapterFactory.build(event, 'transfer-1');
    assert.instanceOf(adapter, TransferEventAdapter);
    assert.equal(adapter.payload.origin, '321');
  });

  it('should return throw an error when event type was invalid to the adapter', async () => {
    const event: EventOperationDTO = { origin: '321', destination: '123', amount: 10, type: 'NEW_OPERATION' };
    const invalidEventError = raiseAppError(AppErrorType.INVALID_EVENT_TYPE);

    expect(() => EventAdapterFactory.build(event, 'new-op-1')).to.throw(invalidEventError.message);
  });
});
