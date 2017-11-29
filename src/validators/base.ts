import { Observable } from 'rxjs';
import validator from 'validatorjs';
import lang from 'validatorjs/src/lang';
import langPt from 'validatorjs/src/lang/pt';

lang._set('en', langPt);

validator.register('zipcode', (value: string) => {
  if (!value) return true;
  return /^\d{8}$/g.test(value);
}, 'Inválido');

export interface IValidatorResult<T> {
  valid: boolean;
  errors?: Validator.ValidationErrors;
  model: T;
}

export abstract class BaseValidator<T> {
  private rules: any;
  private messages: any = {
    same: 'A confirmação não coincide.',
    confirmed: 'A confirmação não coincide.',
    after: 'Deve ser depois que :after.',
    after_or_equal: 'Deve ser igual ou depois que :after_or_equal.',
    email: 'Inválido',
    date: 'Inválido',
    in: 'Inválido',
    integer: 'Inválido',
    min: {
      numeric: 'Valor mínimo :min',
      string: 'Mínimo :min caracteres'
    },
    max: {
      numeric: 'Valor máximo :max',
      string: 'Máximo :max caracteres'
    },
    required: 'Obrigatório',
    required_if: 'Obrigatório'
  };

  constructor(rules: any) {
    this.rules = rules;
  }

  public validate(model: any): Observable<IValidatorResult<T>> {
    const result = new validator(model || {}, this.rules, this.messages);

    if (result.passes()) {
      return Observable.of({ valid: true, model: this.cleanModel(model), errors: {} });
    }

    const allErrors = result.errors.all();
    const errors = Object.keys(allErrors).reduce<any>((acc, key) => {
      acc[key] = allErrors[key][0];
      return acc;
    }, {});
    return Observable.of({ valid: false, errors, model });
  }

  private cleanModel(model: any, rules: any = this.rules): T {
    const result: any = {};

    Object.keys(rules).forEach(key => {
      let value = model[key];

      if (typeof value === 'string') {
        value = value.trim();
      }

      if (value && typeof value === 'object' && !Array.isArray(!value) && !(value instanceof Date)) {
        value = this.cleanModel(value, rules[key]);
      }

      result[key] = value;
    });

    return result;
  }
}