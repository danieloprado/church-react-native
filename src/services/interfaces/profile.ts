import { Observable } from 'rxjs';

import { IUser } from '../../interfaces/user';

export interface IProfileService {
  register(provider: string, accessToken: string): Observable<void>;
  get(refresh?: boolean): Observable<IUser>;
  save(model: IUser): Observable<IUser>;
  logout(): Observable<void>;
}