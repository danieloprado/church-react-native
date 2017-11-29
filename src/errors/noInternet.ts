import { ServiceError } from './serviceError';

export class NoInternetError extends ServiceError {
  constructor() {
    super('no-internet');
  }
}