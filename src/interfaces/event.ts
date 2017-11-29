import { IQuiz } from './quiz';

export interface IEventDate {
  eventId: number;
  beginDate: Date;
  endDate: Date;

  firstOfDate?: boolean;
  event?: IEvent;
}

export interface IEvent {
  id: number;
  churchId?: number;
  title: string;
  description: string;
  dates: IEventDate[];

  featured: boolean;
  featuredText?: string;
  image?: string;
  quizId?: number;

  enableQuiz: boolean;
  quiz?: IQuiz;
}