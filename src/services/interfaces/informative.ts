import { Observable } from 'rxjs';

import { IInformative } from '../../interfaces/informative';

export interface IInformativeService {
  list(refresh?: boolean): Observable<IInformative[]>;
  get(id: number, refresh?: boolean): Observable<IInformative>;
  last(refresh?: boolean): Observable<IInformative>;
}