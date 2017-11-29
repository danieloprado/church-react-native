import * as settings from '../../settings';
import { Container } from '../container';
import { IApiService } from '../interfaces/api';
import { ApiService } from '../models/api';

export function apiFactory(container: Container): IApiService {
  return new ApiService(
    settings.apiEndpoint,
    container.get('logService'),
    container.get('tokenService')
  );
}