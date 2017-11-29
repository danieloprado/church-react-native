import lodash from 'lodash';

import { dateFormatter } from '../formatters/date';
import { IChurchReport } from '../interfaces/churchReport';

export function churchReportListFormatter(reports: IChurchReport[]): IChurchReport[] {
  return lodash.orderBy(mapper(reports), ['date', 'id']);
}

function mapper(reports: IChurchReport[]): IChurchReport[] {
  return reports.map(r => dateFormatter.parseObj(r));
}