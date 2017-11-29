import { Body, Button, Container, Content, H2, Header, Icon, Left, Right, Text, Title, View } from 'native-base';
import * as React from 'react';
import { StyleSheet } from 'react-native';
import { Observable } from 'rxjs/Rx';

import { BaseComponent, IStateBase } from '../../components/base';
import { QuizFormModal } from '../../components/quizFormModal';
import { dateFormatter } from '../../formatters/date';
import { IEvent, IEventDate } from '../../interfaces/event';
import { IQuizAnswer } from '../../interfaces/quizAnswer';
import { toast } from '../../providers/toast';
import * as services from '../../services';
import { IQuizService } from '../../services/interfaces/quiz';
import { variables } from '../../theme';

interface IState extends IStateBase {
  event: IEvent;
  date: IEventDate;
  error?: any;
}

export default class EventDetailsPage extends BaseComponent<IState> {
  private quizService: IQuizService;

  constructor(props: any) {
    super(props);

    this.quizService = services.get('quizService');

    this.state = {
      event: this.params.event,
      date: this.params.date
    };
  }

  public form(): void {
    const { event } = this.state;

    (this.refs.quizForm as QuizFormModal)
      .show('Inscrição', event.quiz, this.saveForm.bind(this))
      .logError()
      .bindComponent(this)
      .subscribe(result => {
        if (!result) return;
        toast('Inscrição efetuada com sucesso!');
      });
  }

  public saveForm(model: IQuizAnswer): Observable<void> {
    return this.quizService.saveAnswer(model).loader();
  }

  public render(): JSX.Element {
    const { event, date } = this.state;

    return (
      <Container>
        <QuizFormModal ref='quizForm' />
        <Header>
          <Left>
            <Button transparent onPress={() => this.goBack()}>
              <Icon name='arrow-back' />
            </Button>
          </Left>
          <Body>
            <Title>Evento</Title>
          </Body>
          <Right />
        </Header>
        <Content>
          <View style={styles.header}>
            <H2 style={styles.headerText}>{event.title}</H2>
            <Text note style={styles.headerNote}>
              {dateFormatter.format(date.beginDate, 'ddd, DD [de] MMMM [de] YYYY [às] HH:mm')}
              {date.endDate ? ' - ' + dateFormatter.format(date.endDate, 'HH:mm') : ''}
            </Text>
          </View>
          <Text style={styles.content}>
            {event.description || 'Sem descrição'}
          </Text>
          {!!event.quiz &&
            <View padder>
              <Button block onPress={() => this.form()}>
                <Text>Fazer inscrição</Text>
              </Button>
            </View>
          }
        </Content>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: variables.accent,
    padding: 16
  },
  headerText: {
    color: 'white'
  },
  headerNote: {
    color: 'white',
    opacity: 0.8
  },
  content: {
    padding: 16
  }
});