import { Observable } from 'rxjs/Observable';
import { Subscriber, Subscription } from 'rxjs/Rx';

import { ICache } from '../interfaces/cache';
import * as services from '../services';
import { ICacheService } from '../services/interfaces/cache';
import { ILogService } from '../services/interfaces/log';

interface IOptions {
  refresh: boolean;
  persist: boolean;
  expirationMinutes: number;
}

function cache<T>(this: Observable<T>, key: string, options: Partial<IOptions> = {}): Observable<T> {
  const defaultOptions: IOptions = {
    refresh: false,
    persist: true,
    expirationMinutes: 5
  };

  return this.lift(new CacheOperator(key, { ...defaultOptions, ...options }));
}

Observable.prototype.cache = cache;

declare module 'rxjs/Observable' {
  // tslint:disable-next-line:interface-name
  interface Observable<T> { cache: typeof cache; }
}

class CacheOperator {
  private cacheService: ICacheService;
  private logService: ILogService;

  constructor(
    private key: string,
    private options: IOptions
  ) {
    this.cacheService = services.get('cacheService');
    this.logService = services.get('logService');
  }

  public call(subscriber: Subscriber<any>, source: Observable<any>): Subscription {
    if (this.options.refresh) {
      return source
        .do(data => this.cacheService.saveData(this.key, data, this.options))
        .subscribe(subscriber);
    }

    let currentCache: ICache;
    return this.cacheService.getData(this.key)
      .switchMap(cache => {
        currentCache = cache;
        if (cache && !this.cacheService.isExpirated(cache)) {
          return Observable.of(cache.data);
        }

        return !cache ? source : source.startWith(cache.data);
      })
      .switchMap(data => {
        if (currentCache && currentCache.data === data) {
          this.logService.breadcrumb('Cache', 'manual', data);
          return Observable.of(data);
        }

        this.logService.breadcrumb('Cache Set', 'manual', data);
        return this.cacheService.saveData(this.key, data, this.options).map(() => data);
      })
      .subscribe(subscriber);
  }
}