import { Observable } from 'rxjs/Rx';

import { IQuizAnswer } from '../../interfaces/quizAnswer';
import { IApiService } from '../interfaces/api';
import { IQuizService } from '../interfaces/quiz';

export class QuizService implements IQuizService {
  constructor(private apiService: IApiService) { }

  public saveAnswer(model: IQuizAnswer): Observable<void> {
    return this.apiService.post('quiz', model);
  }
}