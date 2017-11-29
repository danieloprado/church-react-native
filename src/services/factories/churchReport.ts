import { Container } from '../container';
import { IChurchReportService } from '../interfaces/chuchReport';
import { ChurchReportService } from '../models/churchReport';

export function churchReportFactory(container: Container): IChurchReportService {
  return new ChurchReportService(container.get('apiService'));
}