import { Container } from '../container';
import { IStorageService } from '../interfaces/storage';
import { StorageService } from '../models/storage';

export function storageFactory(container: Container): IStorageService {
  return new StorageService();
}