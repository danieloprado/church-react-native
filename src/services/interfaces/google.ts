import { Observable } from 'rxjs';

export interface IGoogleService {
  login(): Observable<string>;
}