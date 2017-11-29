import { Observable } from 'rxjs/Rx';

import { IChurch } from '../../interfaces/church';

export interface IChurchSevice {
  info(refresh?: boolean): Observable<IChurch>;
}