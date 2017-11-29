import { Button, Card, CardItem, H2, Text, View } from 'native-base';
import * as React from 'react';
import { Image, StyleSheet } from 'react-native';
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

class EventFeaturedCard extends BaseComponent<IState> {
  private eventService: IEventService;

  constructor(props: any) {
    super(props);

    this.eventService = services.get('eventService');
    this.state = { loading: true };
  }

  public componentDidMount(): void {
    this.eventService.next(true)
      .logError()
      .bindComponent(this)
      .last()
      .subscribe(event => {
        this.setState({ loading: false, event });
      }, () => this.setState({ loading: false }));
  }

  public details(): void {
    const { event } = this.state;
    this.navigate('EventDetails', { event, date: event.dates[0] });
  }

  public render(): JSX.Element {
    const { event, loading } = this.state;

    return (
      <View>
        {!loading && !!event &&
          <Card>
            <Image
              style={styles.image}
              source={{ uri: 'http://icbnews.com.br/wp-content/uploads/2015/09/encontro-com-o-amor-de-deus-1024x639.jpg' }}
            />
            <CardItem header style={styles.header}>
              <View>
                <H2>{event.title}</H2>
                <Text note>
                  {dateFormatter.format(event.dates[0].beginDate, 'dddd, DD [de] MMMM [de] YYYY [às] HH:mm')}
                </Text>
              </View>
            </CardItem>
            <CardItem>
              <Text>{event.featuredText}</Text>
            </CardItem>
            <CardItem footer style={theme.alignRight}>
              <Button transparent onPress={() => this.details()}>
                <Text>DETALHES</Text>
              </Button>
            </CardItem>
          </Card>
        }
      </View>
    );
  }
}

const styles = StyleSheet.create({
  image: {
    flex: 1,
    height: variables.deviceHeight * 0.2,
    resizeMode: 'cover'
  },
  header: {
    paddingBottom: 0
  },
  viewContent: {
    width: variables.deviceWidth - 120
  }
});

export default withNavigation(EventFeaturedCard);