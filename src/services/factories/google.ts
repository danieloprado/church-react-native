import { googleApi } from '../../settings';
import { Container } from '../container';
import { IGoogleService } from '../interfaces/google';
import { GoogleService } from '../models/google';

export function googleFactory(container: Container): IGoogleService {
  return new GoogleService(
    container.get('logService'),
    googleApi
  );
}