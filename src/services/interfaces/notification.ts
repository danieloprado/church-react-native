import { NavigationAction, NavigationRoute, NavigationScreenProp } from 'react-navigation';
import { Observable } from 'rxjs/Rx';

export interface INotificationService {
  setup(navigator: NavigationScreenProp<NavigationRoute<any>, NavigationAction>): void;
  getToken(): Observable<string>;
  appDidOpen(): void;
  hasInitialNotification(): Observable<boolean>;
  onNotification(): Observable<{ action?: string, data?: any; }>;
}
