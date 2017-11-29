export enum enQuizQuestionType {
  text = 'text',
  email = 'email',
  phone = 'phone',
  date = 'date',
  zipcode = 'zipcode',
  number = 'number',
  boolean = 'boolean',
  chooseOne = 'choose-one',
  multiple = 'multiple',
  list = 'list'
}

export enum enQuizPurpose {
  welcomeCard = 'welcome-card',
  event = 'event',
}

export interface IQuizOption {
  title: string;
  description?: string;
}

export interface IQuizQuestion {
  id: string;
  title: string;
  description?: string;
  type: enQuizQuestionType;
  required: boolean;
  options?: IQuizOption[];
  enableOtherOption: boolean;
}

export interface IQuiz {
  id?: number;
  purpose: enQuizPurpose;
  churchId: number;
  version?: number;
  questions: IQuizQuestion[];
  createdDate?: Date;
  updatedDate?: Date;
}