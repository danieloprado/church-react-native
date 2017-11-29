import { Observable } from 'rxjs/Rx';

import { IChurchReport } from '../../interfaces/churchReport';
import { IChurchReportType } from '../../interfaces/churchReportType';

export interface IChurchReportService {
  list(refresh?: boolean): Observable<IChurchReport[]>;
  types(): Observable<IChurchReportType[]>;
  save(model: IChurchReport): Observable<IChurchReport>;
}