import { isDevelopment } from '../../settings';
import { Container } from '../container';
import { ILogService } from '../interfaces/log';
import { LogService } from '../models/log';

export function logFactory(container: Container): ILogService {
  return new LogService(isDevelopment);
}