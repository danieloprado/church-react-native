import { Body, Button, Container, Content, Header, Icon, Left, List, ListItem, Right, Text, Title, View } from 'native-base';
import * as React from 'react';
import { RefreshControl, StyleSheet } from 'react-native';
import { NavigationDrawerScreenOptions } from 'react-navigation';

import { BaseComponent, IStateBase } from '../../components/base';
import { EmptyMessage } from '../../components/emptyMessage';
import { ErrorMessage } from '../../components/errorMessage';
import { dateFormatter } from '../../formatters/date';
import { eventListFormatter, IEventListFormatted } from '../../formatters/eventList';
import { toast } from '../../providers/toast';
import * as services from '../../services';
import { IEventService } from '../../services/interfaces/event';

interface IState extends IStateBase {
  refreshing: boolean;
  eventGroup: IEventListFormatted[];
  error?: any;
}

export default class EventListPage extends BaseComponent<IState> {
  public static navigationOptions: NavigationDrawerScreenOptions = {
    drawerLabel: 'Agenda' as any,
    drawerIcon: ({ tintColor }) => (
      <Icon name='calendar' style={{ color: tintColor }} />
    )
  };

  private eventService: IEventService;

  constructor(props: any) {
    super(props);

    this.eventService = services.get('eventService');
    this.state = { refreshing: true, error: false, eventGroup: [] };
  }

  public componentDidMount(): void {
    this.load();
  }

  public details(eventDate: IEventListFormatted): void {
    this.navigate('EventDetails', { event: eventDate.event, date: eventDate });
  }

  public load(refresh: boolean = false): void {
    this.setState({ refreshing: true }, true);

    this.eventService.list(refresh)
      .logError()
      .bindComponent(this)
      .subscribe(events => {
        const eventGroup = eventListFormatter(events || []);
        this.setState({ refreshing: false, error: false, eventGroup });
      }, error => {
        if (refresh) toast('Não conseguimos atualizar');
        this.setState({ refreshing: false, error });
      });
  }

  public render(): JSX.Element {
    const { refreshing, error, eventGroup } = this.state;

    return (
      <Container>
        <Header>
          <Left>
            <Button transparent onPress={() => this.openDrawer()}>
              <Icon name='menu' />
            </Button>
          </Left>
          <Body>
            <Title>Agenda</Title>
          </Body>
          <Right />
        </Header>
        <Content refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={() => this.load(true)} />
        }>
          {!refreshing && error && !eventGroup.length &&
            <ErrorMessage error={error} />
          }
          {!refreshing && !error && !eventGroup.length &&
            <EmptyMessage icon='calendar' message='Nenhum evento próximo' />
          }
          <List dataArray={eventGroup} renderRow={(data, sectionId, rowId) => this.renderRow(data, rowId)} />
        </Content>
      </Container>
    );
  }

  public renderRow(data: IEventListFormatted, rowId: any): JSX.Element {
    return (
      <View key={(data.divider ? data.beginDate : data.event.id) as any}>
        {data.divider ?
          <ListItem style={rowId === '0' ? styles.listItemHeaderFirst : styles.listItemHeader}>
            <Text style={styles.listItemHeaderText}>
              {dateFormatter.format(data.date, 'MMMM').toUpperCase()}
            </Text>
          </ListItem>
          :
          <ListItem style={styles.listItem}>
            {data.firstOfDate ?
              <Left style={styles.leftWrapper}>
                <Text style={styles.eventDay}>
                  {dateFormatter.format(data.beginDate, 'DD')}
                </Text>
                <Text style={styles.eventWeekDay}>
                  {dateFormatter.format(data.beginDate, 'ddd')}
                </Text>
              </Left>
              :
              <Left style={styles.leftWrapper} />
            }
            <Body>
              <Button
                block
                onPress={() => this.details(data)}
                style={styles.buttonDetails}>
                <Text style={styles.eventTitle}>{data.event.title}</Text>
                <Text style={styles.eventHour}>
                  {
                    dateFormatter.format(data.beginDate, 'HH:mm') +
                    (data.endDate ? ' - ' + dateFormatter.format(data.endDate, 'HH:mm') : '')
                  }
                </Text>
              </Button>
            </Body>
          </ListItem>
        }
      </View>
    );
  }
}

const styles = StyleSheet.create({
  listItemHeader: {
    borderBottomWidth: 0,
    marginTop: 20
  },
  listItemHeaderFirst: {
    borderBottomWidth: 0,
  },
  listItemHeaderText: {
    fontWeight: 'bold',
    opacity: 0.6
  },
  listItem: {
    borderBottomWidth: 0,
    marginLeft: 0,
    paddingTop: 10,
    paddingBottom: 10,
  },
  leftWrapper: {
    maxWidth: 50,
    opacity: 0.5,
    flexDirection: 'column'
  },
  eventDay: {
    fontSize: 24,
    textAlign: 'center'
  },
  eventWeekDay: {
    textAlign: 'center'
  },
  eventTitle: {
    fontSize: 16,
    marginBottom: 2,
    lineHeight: 22
  },
  eventHour: {
    opacity: 0.8
  },
  icon: {
    width: 40,
    fontSize: 30
  },
  buttonDetails: {
    marginLeft: 15,
    height: null,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    flexDirection: 'column',
    paddingLeft: 10,
    paddingRight: 10
  }
});