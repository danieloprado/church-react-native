import { Observable } from 'rxjs';

export interface IFacebookService {
  login(): Observable<string>;
}