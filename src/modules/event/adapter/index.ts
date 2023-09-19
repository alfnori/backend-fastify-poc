import IControllerAdapter from '@common/interfaces/controllerAdapters';
import { HttpResponse } from '@common/types/http';

export default interface IEventAdapter extends IControllerAdapter {
  readonly payload: Record<string, unknown>;
  readonly trackerId: string;
  resolve(): Promise<HttpResponse>;
}
