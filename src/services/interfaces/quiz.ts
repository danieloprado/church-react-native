import { Observable } from 'rxjs/Rx';

import { IQuizAnswer } from '../../interfaces/quizAnswer';

export interface IQuizService {
  saveAnswer(model: IQuizAnswer): Observable<void>;
}