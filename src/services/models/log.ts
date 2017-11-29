import { Client, Configuration } from 'bugsnag-react-native';

import { IUserToken } from '../../interfaces/userToken';
import { ILogService } from '../interfaces/log';

export class LogService implements ILogService {
  private bugsnag: any;

  constructor(private isDevelopment: boolean) {

    const config = new Configuration();
    config.notifyReleaseStages = ['production'];

    this.bugsnag = new Client(config);
  }

  public setUser(user: IUserToken): void {
    if (!user) {
      this.bugsnag.clearUser();
      return;
    }

    this.bugsnag.setUser(user.id.toString(), user.fullName);
  }

  public breadcrumb(text: string, type: string = 'manual', extraData: any = {}): void {
    if (this.isDevelopment) console.log('breadcrumb: ' + type + ' - ' + text);

    extraData = extraData || {};
    delete extraData.type;

    this.bugsnag.leaveBreadcrumb(text, { type, data: extraData });
  }

  public handleError(err: any, force: boolean = false): void {
    if (!err) return;

    if (typeof err === 'string') {
      err = new Error(err);
    }

    if (this.isDevelopment) {
      console.error(err);
      console.log(err.metadata);
      return;
    }

    if (['NETWORK_ERROR'].includes(err.message)) {
      return;
    }

    if (err.ignoreLog && !force) {
      return;
    }

    this.bugsnag.notify(err, function (report: any): void {
      report.metadata = { metadata: err.metadata, err };
    });
  }

}