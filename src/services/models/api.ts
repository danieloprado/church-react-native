import axios, { AxiosResponse } from 'axios';
import { NetInfo } from 'react-native';
import { Observable, ReplaySubject } from 'rxjs';

import { ApiError } from '../../errors/api';
import { NoInternetError } from '../../errors/noInternet';
import { IApiService } from '../interfaces/api';
import { ILogService } from '../interfaces/log';
import { ITokenService } from '../interfaces/token';

export class ApiService implements IApiService {
  private connection$: ReplaySubject<boolean>;

  constructor(
    private apiEndpoint: string,
    private logService: ILogService,
    private tokenService: ITokenService
  ) {
    this.connection$ = new ReplaySubject(1);
    this.watchNetwork();
  }

  public get<T = any>(url: string, params?: any): Observable<T> {
    return this.request('GET', url, params);
  }

  public post<T = any>(url: string, body: any): Observable<T> {
    return this.request('POST', url, body);
  }

  public connection(): Observable<boolean> {
    return this.connection$.distinctUntilChanged();
  }

  private request<T>(method: string, url: string, data: any = null): Observable<T> {
    return this.connection$
      .sampleTime(500)
      .first()
      .switchMap(connected => {
        return !connected ?
          Observable.throw(new NoInternetError()) :
          this.tokenService.getToken().first();
      })
      .map(tokens => {
        return !tokens ? {} : {
          Authorization: `bearer ${tokens.accessToken}`,
          RefreshToken: tokens.refreshToken
        };
      })
      .switchMap(headers => {
        return Observable.fromPromise(axios.request({
          baseURL: this.apiEndpoint,
          url,
          method,
          timeout: 30000,
          headers: {
            'Content-type': 'application/json',
            ...headers
          },
          params: method === 'GET' ? data : null,
          data: method === 'POST' ? data : null
        }));
      })
      .switchMap(res => this.checkNewToken(res))
      .map(response => response.data)
      .catch(err => {
        return !err.config ?
          Observable.throw(err) :
          Observable.throw(new ApiError(err.config, err.response, err));
      });
  }

  private checkNewToken(response: AxiosResponse): Observable<AxiosResponse> {
    const accessToken = response.headers['x-token'];

    if (!accessToken) {
      return Observable.of(response);
    }

    this.logService.breadcrumb('Api New Token', 'manual', accessToken);

    return this.tokenService
      .setAccessToken(accessToken)
      .map(() => response);
  }

  private watchNetwork(): void {
    NetInfo.isConnected.fetch().then(isConnected => this.connection$.next(isConnected));
    NetInfo.isConnected.addEventListener('connectionChange', isConnected => {
      this.connection$.next(isConnected);
    });
  }

}