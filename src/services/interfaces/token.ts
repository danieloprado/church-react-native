import { Observable } from 'rxjs';

import { IAuthToken } from '../../interfaces/authToken';
import { IUserToken } from '../../interfaces/userToken';

export interface ITokenService {
  getToken(): Observable<IAuthToken>;
  getUser(): Observable<IUserToken>;
  setToken(tokens: IAuthToken): Observable<void>;
  clearToken(): Observable<void>;
  setAccessToken(accessToken: string): Observable<void>;
  isAuthenticated(): Observable<boolean>;
}