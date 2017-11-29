import { Observable } from 'rxjs/Rx';

import { dateFormatter } from '../../formatters/date';
import { IEvent } from '../../interfaces/event';
import { IApiService } from '../interfaces/api';
import { IEventService } from '../interfaces/event';

export class EventService implements IEventService {
  constructor(private apiService: IApiService) { }

  public list(refresh?: boolean): Observable<IEvent[]> {
    return this.apiService.get<IEvent[]>('events')
      .cache('service-event-list', { refresh })
      .map(data => {
        return (data || []).map(event => {
          event.dates = event.dates.map(d => dateFormatter.parseObj(d));
          return event;
        }).sort((a, b) => this.sortByFirstDate(a, b));
      });
  }

  public next(featured: boolean): Observable<IEvent> {
    return this.list().map(events => {
      if (featured === undefined) {
        return events[0];
      }

      return events.find(e => e.featured === featured);
    });
  }

  private sortByFirstDate(a: IEvent, b: IEvent): number {
    if (a.dates[0].beginDate === b.dates[0].beginDate) return 0;
    if (a.dates[0].beginDate < b.dates[0].beginDate) return -1;
    return 1;
  }

}