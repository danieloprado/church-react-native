import { Container } from '../container';
import { IQuizService } from '../interfaces/quiz';
import { QuizService } from '../models/quiz';

export function quizFactory(container: Container): IQuizService {
  return new QuizService(container.get('apiService'));
}