import { HttpResponse } from '@common/types/http';

export type Params = Record<string, unknown>;

export default interface IControllerAdapter {
  resolve(params?: Params): Promise<HttpResponse>;
}
