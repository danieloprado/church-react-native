import { Observable } from 'rxjs';

export interface IApiService {
  get<T = any>(url: string, params?: any): Observable<T>;
  post<T = any>(url: string, body: any): Observable<T>;
  connection(): Observable<boolean>;
}