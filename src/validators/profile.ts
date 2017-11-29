import { IUser } from '../interfaces/user';
import { BaseValidator } from './base';

export class ProfileValidator extends BaseValidator<IUser> {
  constructor() {
    super({
      id: 'integer|required|min:1',
      firstName: 'string|required|min:3|max:50',
      lastName: 'string|max:50',
      email: 'string|email|max:150',
      gender: 'string|in:f,m',
      birthday: 'date',
      zipcode: 'zipcode',
      address: 'string|max:150',
      neighborhood: 'string|max:100',
      city: 'string|max:100',
      state: 'string|max:2',
      number: 'string|max:10',
      complement: 'string|max:10',
    });
  }
}