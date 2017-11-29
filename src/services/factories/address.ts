import * as settings from '../../settings';
import { Container } from '../container';
import { IAddressService } from '../interfaces/address';
import { AddressService } from '../models/address';

export function addressFactory(container: Container): IAddressService {
  return new AddressService(
    settings.defaultAddress.state,
    settings.defaultAddress.city
  );
}