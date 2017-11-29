import { AccessToken, LoginManager } from 'react-native-fbsdk';
import { Observable } from 'rxjs';

import { IFacebookService } from '../interfaces/facebook';
import { ILogService } from '../interfaces/log';

export class FacebookService implements IFacebookService {
  constructor(private logService: ILogService) { }

  public login(): Observable<string> {
    return Observable
      .of(true)
      .do(() => this.logService.breadcrumb('Facebook Login'))
      .do(() => LoginManager.logOut())
      .switchMap(() => Observable.fromPromise(LoginManager.logInWithReadPermissions(['public_profile', 'email'])))
      .switchMap(({ isCancelled }) => {
        if (isCancelled) {
          return Observable.of({ accessToken: null });
        }

        return Observable.fromPromise(AccessToken.getCurrentAccessToken());
      })
      .catch(err => {
        if (err.message === 'Login Failed') return Observable.empty();
        return Observable.throw(err);
      })
      .map(({ accessToken }) => accessToken)
      .do(a => this.logService.breadcrumb(`Facebook Login ${a ? 'Completed' : 'Cancelled'}`));
  }

}