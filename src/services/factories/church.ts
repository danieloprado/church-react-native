import { Container } from '../container';
import { IChurchSevice } from '../interfaces/church';
import { ChurchService } from '../models/church';

export function churchFactory(container: Container): IChurchSevice {
  return new ChurchService(container.get('apiService'));
}