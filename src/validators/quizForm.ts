import { IQuiz } from '../interfaces/quiz';
import { BaseValidator } from './base';

export interface IQuizFormValidatorResult {
  [key: string]: string;
}

export class QuizFormValidator extends BaseValidator<IQuizFormValidatorResult> {
  constructor(quiz: IQuiz) {
    const typeRules: any = {
      text: 'string',
      email: 'string|email',
      phone: 'string',
      date: 'date',
      zipcode: 'string|zipcode',
      number: 'number',
      boolean: 'boolean',
      chooseOne: 'string',
      multiple: 'string',
    };

    super(quiz.questions.reduce((rules: any, question, index) => {
      rules[`question-${index}`] = typeRules[question.type];
      rules[`question-${index}`] += question.required ? '|required' : '';

      return rules;
    }, {}));
  }
}