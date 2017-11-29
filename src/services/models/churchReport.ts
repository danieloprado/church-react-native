import * as lodash from 'lodash';
import { Observable, Subject } from 'rxjs';

import { churchReportListFormatter } from '../../formatters/churchReportList';
import { dateFormatter } from '../../formatters/date';
import { IChurchReport } from '../../interfaces/churchReport';
import { IChurchReportType } from '../../interfaces/churchReportType';
import { IApiService } from '../interfaces/api';

export class ChurchReportService {
  private reports: IChurchReport[];
  private reportUpdate$: Subject<IChurchReport[]>;

  constructor(private apiService: IApiService) {
    this.reports = [];
    this.reportUpdate$ = new Subject();
  }

  public list(refresh: boolean = false): Observable<IChurchReport[]> {
    return this.apiService.get<IChurchReport[]>('church-report')
      .cache('church-report', { refresh })
      .concat(this.reportUpdate$)
      .do(reports => this.reports = reports || [])
      .map(reports => churchReportListFormatter(reports));
  }

  public types(): Observable<IChurchReportType[]> {
    return this.apiService
      .get<IChurchReportType[]>('church-report/types')
      .cache('church-report-types');
  }

  public save(model: IChurchReport): Observable<IChurchReport> {
    return this.apiService.post<IChurchReport>('church-report', model).map(report => {
      return dateFormatter.parseObj(report);
    }).do(report => {
      const reportModel = this.reports.filter(r => r.id === report.id)[0];

      !reportModel ?
        this.reports.push(report) :
        lodash.merge(reportModel, report);

      this.reportUpdate$.next(this.reports);
    });
  }

}