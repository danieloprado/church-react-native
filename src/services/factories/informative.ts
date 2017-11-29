import { Container } from '../container';
import { IInformativeService } from '../interfaces/informative';
import { InformativeService } from '../models/informative';

export function informativeFactory(container: Container): IInformativeService {
  return new InformativeService(container.get('apiService'));
}