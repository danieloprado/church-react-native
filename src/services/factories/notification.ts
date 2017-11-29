import { Container } from '../container';
import { INotificationService } from '../interfaces/notification';
import { NotificationService } from '../models/notification';

export function notificationFactory(container: Container): INotificationService {
  return new NotificationService(
    container.get('storageService'),
    container.get('tokenService')
  );
}