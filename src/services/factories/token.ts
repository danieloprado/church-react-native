import { Container } from '../container';
import { ITokenService } from '../interfaces/token';
import { TokenService } from '../models/token';

export function tokenFactory(container: Container): ITokenService {
  return new TokenService(
    container.get('storageService')
  );
}