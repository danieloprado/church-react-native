import lodash from 'lodash';

import { IEvent, IEventDate } from '../interfaces/event';
import { dateFormatter } from './date';

export interface IEventListFormatted extends Partial<IEventDate> {
  date?: Date;
  divider?: boolean;
}

export function eventListFormatter(events: IEvent[]): IEventListFormatted[] {
  if (!events.length) return [];
  return addDivider(lodash.orderBy(reduceByDate(events), ['beginDate', 'event.title']));
}

function reduceByDate(events: IEvent[]): IEventDate[] {
  return events.reduce((acc, event) => {
    Array.prototype.push.apply(acc, event.dates.map(d => {
      d.event = event;
      return d;
    }));
    return acc;
  }, []);
}

function addDivider(eventDates: IEventDate[]): IEventListFormatted[] {
  let lastMonth: Date = null,
    lastDate: Date = null;

  return eventDates.reduce<IEventListFormatted[]>((acc, eventDate) => {
    if (!lastDate || !isSameDate(lastDate, eventDate.beginDate)) {
      lastDate = eventDate.beginDate;
      eventDate.firstOfDate = true;
    }

    if (!lastMonth || !isSameMonth(lastMonth, eventDate.beginDate)) {
      acc.push({ date: eventDate.beginDate, divider: true });
      lastMonth = eventDate.beginDate;
    }

    acc.push(eventDate);
    return acc;
  }, []);

}

function isSameMonth(date1: Date, date2: Date): boolean {
  return comparer(date1, date2, 'YYYY-MM');
}

function isSameDate(date1: Date, date2: Date): boolean {
  return comparer(date1, date2, 'YYYY-MM-DD');
}

function comparer(date1: Date, date2: Date, format: string): boolean {
  const date1Formatted = dateFormatter.format(date1, format);
  const date2Formatted = dateFormatter.format(date2, format);

  return date1Formatted === date2Formatted;
}