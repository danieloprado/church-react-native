import * as base64 from 'base-64';
import { Observable, ReplaySubject } from 'rxjs';

import { IAuthToken } from '../../interfaces/authToken';
import { IUserToken } from '../../interfaces/userToken';
import { IStorageService } from '../interfaces/storage';
import { ITokenService } from '../interfaces/token';

export class TokenService implements ITokenService {
  private tokens: IAuthToken;
  private authToken$: ReplaySubject<IAuthToken>;

  constructor(private storageService: IStorageService) {
    this.authToken$ = new ReplaySubject(1);

    this.storageService.get('authToken').logError().subscribe(tokens => {
      this.tokens = tokens;
      this.authToken$.next(tokens);
    });
  }

  public getToken(): Observable<IAuthToken> {
    return this.authToken$.distinctUntilChanged();
  }

  public getUser(): Observable<IUserToken> {
    return this.getToken().map(tokens => {
      if (!tokens) return;

      const user = JSON.parse(base64.decode(tokens.accessToken.split('.')[1]));
      user.fullName = `${user.firstName} ${user.lastName}`;
      user.canAccess = (...roles: string[]) => {
        if (!roles || roles.length === 0) return true;
        if (user.roles.includes('sysAdmin') || user.roles.includes('admin')) return true;

        return roles.some(r => user.roles.includes(r));
      };

      return user;
    });
  }

  public setToken(tokens: IAuthToken): Observable<void> {
    return this.storageService.set('authToken', tokens).map(() => {
      this.tokens = tokens;
      this.authToken$.next(tokens);
    });
  }

  public clearToken(): Observable<void> {
    return this.setToken(null).map(() => null);
  }

  public setAccessToken(accessToken: string): Observable<void> {
    this.tokens.accessToken = accessToken;

    return this.storageService.set('authToken', this.tokens).map(() => {
      this.authToken$.next(this.tokens);
    });
  }

  public isAuthenticated(): Observable<boolean> {
    return this.getToken().map(token => !!token);
  }
}