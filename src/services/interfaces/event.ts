import { Observable } from 'rxjs/Rx';

import { IEvent } from '../../interfaces/event';

export interface IEventService {
  list(refresh?: boolean): Observable<IEvent[]>;
  next(featured: boolean): Observable<IEvent>;
}