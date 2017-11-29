import { Body, Button, Card, CardItem, Icon, Right, Spinner, Text, View } from 'native-base';
import * as React from 'react';
import { StyleSheet } from 'react-native';
import { withNavigation } from 'react-navigation';

import { BaseComponent, IStateBase } from '../../../components/base';
import { dateFormatter } from '../../../formatters/date';
import { IEvent } from '../../../interfaces/event';
import * as services from '../../../services';
import { IEventService } from '../../../services/interfaces/event';
import { theme, variables } from '../../../theme';

interface IState extends IStateBase {
  loading: boolean;
  event?: IEvent;
  error?: any;
}

class EventCard extends BaseComponent<IState> {
  private eventService: IEventService;

  constructor(props: any) {
    super(props);

    this.eventService = services.get('eventService');
    this.state = { loading: true };
  }

  public componentDidMount(): void {
    this.eventService.next(false)
      .logError()
      .bindComponent(this)
      .subscribe(event => {
        this.setState({ loading: false, error: false, event });
      }, () => this.setState({ loading: false, error: true }));
  }

  public render(): JSX.Element {
    const { event, loading, error } = this.state;

    return (
      <Card>
        <CardItem header>
          <Text>Próximo Evento</Text>
        </CardItem>
        {loading &&
          <CardItem>
            <Body style={theme.alignCenter}>
              <Spinner />
            </Body>
          </CardItem>
        }
        {!loading && error && !event &&
          <CardItem style={theme.alignCenter}>
            <Text note>Não conseguimos atualizar</Text>
          </CardItem>
        }
        {!loading && !error && !event &&
          <CardItem style={theme.alignCenter}>
            <Text note>Nenhum evento próximo</Text>
          </CardItem>
        }
        {!loading && event &&
          <View>
            <CardItem button onPress={() => this.navigate('EventDetails', { event, date: event.dates[0] })}>
              <Icon name='calendar' />
              <View style={styles.viewContent}>
                <Text numberOfLines={1}>{event.title}</Text>
                <Text note>
                  {dateFormatter.format(event.dates[0].beginDate, 'dddd, DD [de] MMMM [de] YYYY')}
                </Text>
                <Text note>
                  {dateFormatter.format(event.dates[0].beginDate, 'HH:mm')}
                  {event.dates[0].endDate ? ' - ' + dateFormatter.format(event.dates[0].endDate, 'HH:mm') : ''}
                </Text>
              </View>
              <Right>
                <Icon name='arrow-forward' />
              </Right>
            </CardItem>
            <CardItem footer style={theme.alignRight}>
              <Button transparent onPress={() => this.navigate('Event')}>
                <Text>VER TODOS</Text>
              </Button>
            </CardItem>
          </View>
        }

      </Card>
    );
  }
}

const styles = StyleSheet.create({
  viewContent: {
    width: variables.deviceWidth - 120
  }
});

export default withNavigation(EventCard);