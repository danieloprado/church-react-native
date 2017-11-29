import { Subscriber } from 'rxjs';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Rx';

import * as services from '../services';
import { ILogService } from '../services/interfaces/log';

interface IIgnoreParam {
  (err: any): boolean;
}

function logError<T>(this: Observable<T>, ignore: IIgnoreParam = null): Observable<T> {
  return this.lift(new LogErrorOperator(ignore));
}

Observable.prototype.logError = logError;

declare module 'rxjs/Observable' {
  // tslint:disable-next-line:interface-name
  interface Observable<T> { logError: typeof logError; }
}

class LogErrorOperator {
  constructor(private ignore: IIgnoreParam) { }

  public call(subscriber: Subscriber<any>, source: Observable<any>): Subscription {
    return source.subscribe(new LogErrorSubscriber(subscriber, this.ignore));
  }
}

class LogErrorSubscriber extends Subscriber<any> {
  private logService: ILogService;

  constructor(
    protected destination: Subscriber<any>,
    private ignore: IIgnoreParam
  ) {
    super(destination);

    this.ignore = ignore;
    this.logService = services.get('logService');
  }

  public _next(value: any): void {
    this.destination.next(value);
  }

  public _complete(): void {
    this.destination.complete();
  }

  public _error(err: any): void {
    if (!this.ignore || !this.ignore(err)) {
      this.logService.handleError(err);
    }

    this.destination.error(err);
  }
}