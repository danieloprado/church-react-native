import { ISelectItem } from '../../interfaces/selectItem';

export interface IAddressService {
  getStates(): ISelectItem[];
  getCities(stateCode?: string): ISelectItem[];
}