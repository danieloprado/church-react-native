import { Observable } from 'listr/node_modules/rxjs/Rx';
import { Body, Button, Container, Content, Form, Header, Icon, Left, Right, Text, Title } from 'native-base';
import * as React from 'react';
import { ListView, ListViewDataSource, Modal } from 'react-native';
import { Subject } from 'rxjs';

import { IQuiz, IQuizQuestion } from '../interfaces/quiz';
import { IQuizAnswer } from '../interfaces/quizAnswer';
import { QuizFormValidator } from '../validators/quizForm';
import { BaseComponent, IStateBase } from './base';
import { Field } from './field';

interface IState extends IStateBase {
  show: boolean;
  quiz?: IQuiz;
  submitted?: boolean;
  title?: string;
  submitCallback?: (value: IQuizAnswer) => Observable<any>;
}

export class QuizFormModal extends BaseComponent<IState> {
  private dataSource: ListViewDataSource;
  private result$: Subject<IQuizAnswer>;
  private validator: QuizFormValidator;

  constructor(props: any) {
    super(props);

    this.dataSource = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });

    this.result$ = null;
    this.state = { show: false };
  }

  public show(title: string, quiz: IQuiz, submitCallback: (value: IQuizAnswer) => Observable<any>): Subject<IQuizAnswer> {
    this.setState({ show: true, submitted: false, title, quiz, model: {}, submitCallback, validation: null });

    this.validator = new QuizFormValidator(quiz);

    this.result$ = new Subject();
    return this.result$;
  }

  public render(): JSX.Element {
    const { show, title, quiz, model, validation, submitted } = this.state;
    const types: any = { 'choose-one': 'dropdown', 'multiple': 'text' };
    const icons: any = { 'Nome': 'person', 'Nascimento': 'calendar', 'Celular': 'phone-portrait' };

    return (
      <Modal
        animationType='slide'
        transparent={false}
        visible={show}
        onRequestClose={() => this.hide()}>
        <Container>
          <Header>
            <Left>
              <Button transparent onPress={() => this.hide()}>
                <Icon name='close' />
              </Button>
            </Left>
            <Body>
              <Title>{title}</Title>
            </Body>
            <Right />
          </Header>
          <Content padder keyboardShouldPersistTaps='handled'>
            {show &&
              <Form>
                <ListView
                  removeClippedSubviews={false}
                  enableEmptySections={true}
                  dataSource={this.dataSource.cloneWithRows(quiz.questions)}
                  renderRow={(question, section, index) =>
                    <Field
                      key={question.id}
                      label={question.title}
                      icon={icons[question.title] || 'empty'}
                      value={model[`question-${index}`]}
                      type={types[question.type] || question.type}
                      options={this.getOptions(question)}
                      error={validation[`question-${index}`]}
                      onChange={this.updateModel.bind(this, submitted ? this.validator : null, `question-${index}`)}
                      onSubmit={index === (quiz.questions.length - 1) ? () => this.submit() : undefined}
                    />
                  } />

                <Button block formButton onPress={() => this.submit()}>
                  <Text>Salvar</Text>
                </Button>
              </Form>
            }
          </Content>
        </Container>
      </Modal>
    );
  }

  private hide(): void {
    this.result$.next(null);
    this.result$.complete();

    this.setState({ show: false });
  }

  private complete(result: IQuizAnswer): void {
    this.setState({ show: false });

    this.result$.next(result);
    this.result$.complete();
  }

  private submit(): void {
    const { model, quiz } = this.state;

    this.validator.validate(model)
      .do(({ model, errors }) => this.setState({ validation: errors, model, submitted: true }, true))
      .filter(({ valid }) => valid)
      .map(({ model }) => {
        return {
          quizId: quiz.id,
          quizVersion: quiz.version,
          answers: quiz.questions.map((question, index) => {
            return { title: question.title, answer: model[`question-${index}`] };
          })
        };
      })
      .switchMap(model => this.state.submitCallback(model))
      .logError()
      .bindComponent(this)
      .subscribe(result => this.complete(result));
  }

  private getOptions(question: IQuizQuestion): any {
    if (!question.options) return;

    const options = question.options.map(t => ({ value: t.title, display: t.title }));
    return [{ value: null, display: 'Selecione...' }, ...options];
  }
}