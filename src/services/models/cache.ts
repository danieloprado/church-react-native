import moment from 'moment';
import { Observable } from 'rxjs';

import { ICache } from '../../interfaces/cache';
import { ICacheService } from '../interfaces/cache';
import { IStorageService } from '../interfaces/storage';

export class CacheService implements ICacheService {
  private memory: { [key: string]: ICache };

  constructor(
    private storageService: IStorageService
  ) {
    this.memory = {};
  }

  public isExpirated(cache: ICache): boolean {
    if (cache.expirationDate) {
      return moment(cache.expirationDate).isBefore(moment());
    }

    const difference = Date.now() - new Date(cache.createdAt).getTime();
    return (difference / 1000 / 60) > 5; //5 minutes
  }

  public getData(key: string): Observable<ICache> {
    if (this.memory[key]) return Observable.of(this.memory[key]);
    return this.storageService.get('church-cache-' + key);
  }

  public saveData<T>(key: string, data: T, options: { persist: boolean, expirationMinutes: number }): Observable<ICache<T>> {
    const cache: ICache<T> = {
      createdAt: new Date(),
      expirationDate: moment().add(options.expirationMinutes, 'minutes').toDate(),
      data
    };

    if (options.persist) {
      return this.storageService.set('church-cache-' + key, cache);
    }

    return Observable.of(true).map(() => {
      this.memory[key] = cache;
      return cache;
    });
  }

  public clear(): Observable<void> {
    return this.storageService.clear(/^church-cache-/gi);
  }

}