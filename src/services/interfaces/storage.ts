import { Observable } from 'rxjs';

export interface IStorageService {
  get<T = any>(key: string): Observable<T>;
  set<T = any>(key: string, value: T): Observable<T>;
  clear(regexp: RegExp): Observable<void>;
}