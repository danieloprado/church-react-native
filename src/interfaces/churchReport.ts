import { IChurchReportType } from './churchReportType';

export interface IChurchReport {
  id?: number;
  title: string;
  date: Date;
  totalMembers: number;
  totalNewVisitors: number;
  totalFrequentVisitors: number;
  totalKids: number;
  total?: number;
  creatorId?: number;
  churchId?: number;
  typeId: number;

  type?: IChurchReportType;
}