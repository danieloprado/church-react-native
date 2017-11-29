import { churchSlug } from '../../settings';
import { Container } from '../container';
import { IProfileService } from '../interfaces/profile';
import { ProfileService } from '../models/profile';

export function profileFactory(container: Container): IProfileService {
  return new ProfileService(
    churchSlug,
    container.get('apiService'),
    container.get('cacheService'),
    container.get('notificationService'),
    container.get('tokenService')
  );
}