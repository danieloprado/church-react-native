import { IUserToken } from '../../interfaces/userToken';

export interface ILogService {
  setUser(user: IUserToken): void;
  breadcrumb(text: string, type?: string, extraData?: any): void;
  handleError(err: any, force?: boolean): void;
}