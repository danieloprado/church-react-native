import { Observable } from 'rxjs/Rx';

import { IChurch } from '../../interfaces/church';
import { IApiService } from '../interfaces/api';
import { IChurchSevice } from '../interfaces/church';

export class ChurchService implements IChurchSevice {
  constructor(private apiService: IApiService) { }

  public info(refresh: boolean = false): Observable<IChurch> {
    return this.apiService.get<IChurch>('info').cache('service-church-info', { refresh });
  }
}