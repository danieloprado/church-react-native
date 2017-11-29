import { Observable } from 'rxjs';

import { ICache } from '../../interfaces/cache';

export interface ICacheService {
  isExpirated(cache: ICache): boolean;
  getData<T>(key: string): Observable<ICache<T>>;
  saveData<T>(key: string, data: T, options: { persist: boolean; expirationMinutes: number }): Observable<ICache<T>>;
  clear(): Observable<void>;
}