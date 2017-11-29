import { Container } from '../container';
import { ICacheService } from '../interfaces/cache';
import { CacheService } from '../models/cache';

export function cacheFactory(container: Container): ICacheService {
  return new CacheService(container.get('storageService'));
}