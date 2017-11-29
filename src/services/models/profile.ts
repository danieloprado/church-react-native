import device from 'react-native-device-info';
import { Observable, Subject } from 'rxjs';

import { dateFormatter } from '../../formatters/date';
import { IUser } from '../../interfaces/user';
import { IUserToken } from '../../interfaces/userToken';
import { IApiService } from '../interfaces/api';
import { ICacheService } from '../interfaces/cache';
import { INotificationService } from '../interfaces/notification';
import { IProfileService } from '../interfaces/profile';
import { ITokenService } from '../interfaces/token';

export class ProfileService implements IProfileService {
  private profileUpdate$: Subject<IUser>;

  constructor(
    private churchSlug: string,
    private apiService: IApiService,
    private cacheService: ICacheService,
    private notificationService: INotificationService,
    private tokenService: ITokenService
  ) {
    this.profileUpdate$ = new Subject();

    this.notificationService.getToken()
      .distinctUntilChanged()
      .switchMap(token => this.apiService.connection()
        .filter(c => c)
        .first()
        .map(() => token))
      .combineLatest(this.isLogged())
      .filter(([token, isLogged]) => isLogged)
      .map(([token]) => token)
      .filter(token => !!token)
      .switchMap(token => this.updateNotificationToken(token))
      .logError()
      .subscribe();
  }

  public register(provider: string, accessToken: string): Observable<void> {
    return this.notificationService.getToken()
      .first()
      .switchMap(notificationId => {
        return this.apiService.post('register', {
          deviceId: device.getUniqueID(),
          name: `${device.getBrand()} - ${device.getModel()} (${device.getSystemName()} ${device.getSystemVersion()})`,
          application: this.churchSlug,
          provider,
          accessToken,
          notificationId
        });
      })
      .switchMap(res => this.tokenService.setToken(res));
  }

  public get(refresh?: boolean): Observable<IUser> {
    return this.tokenService.getToken().switchMap(token => {
      if (!token) {
        return Observable.of(null);
      }

      return this.apiService.get<IUser>('profile')
        .cache('service-profile', { refresh })
        .map(profile => {
          return dateFormatter.parseObj(profile);
        }).concat(this.profileUpdate$);
    });
  }

  public save(model: IUser): Observable<IUser> {
    return this.apiService.post<IUser>('profile', model).map(profile => {
      profile = dateFormatter.parseObj(profile);
      this.profileUpdate$.next(profile);
      return profile;
    });
  }

  public isLogged(): Observable<boolean> {
    return this.userChanged().map(t => !!t);
  }

  public userChanged(): Observable<IUserToken> {
    return this.tokenService.getUser()
      .distinctUntilChanged((n, o) => (n || { id: null }).id === (o || { id: null }).id);
  }

  public logout(): Observable<void> {
    return this.apiService
      .post('/auth/logout', { deviceId: device.getUniqueID() })
      .switchMap(() => this.tokenService.clearToken())
      .switchMap(() => this.cacheService.clear());
  }

  private updateNotificationToken(notificationUserId: string): Observable<void> {
    const deviceId = device.getUniqueID();
    const deviceName = `${device.getBrand()} - ${device.getModel()} (${device.getSystemName()} ${device.getSystemVersion()})`;
    const application = this.churchSlug;

    return this.apiService.post('profile/notification-token', { deviceId, application, notificationUserId, deviceName });
  }

}