import { Body, Button, Card, CardItem, Icon, Spinner, Text, View } from 'native-base';
import * as React from 'react';
import { Linking } from 'react-native';
import { withNavigation } from 'react-navigation';

import { BaseComponent, IStateBase } from '../../../components/base';
import { phoneFormatter } from '../../../formatters/phone';
import { IChurch } from '../../../interfaces/church';
import * as services from '../../../services';
import { IChurchSevice } from '../../../services/interfaces/church';
import { theme } from '../../../theme';

interface IState extends IStateBase {
  loading: boolean;
  church?: IChurch;
  error?: any;
}

class ChurchCard extends BaseComponent<IState> {
  private churchService: IChurchSevice;

  constructor(props: any) {
    super(props);

    this.churchService = services.get('churchService');
    this.state = { loading: true };
  }

  public componentDidMount(): void {
    this.churchService.info()
      .logError()
      .bindComponent(this)
      .subscribe(church => {
        this.setState({ loading: false, church });
      }, () => this.setState({ loading: false }));
  }

  public openPhone(): void {
    Linking.openURL(`tel:${this.state.church.phone}`);
  }

  public openAddress(): void {
    const church = this.state.church;
    Linking.openURL(`geo:${church.latitude},${church.longitude}?q=${church.address}`);
  }

  public render(): JSX.Element {
    const { church, loading } = this.state;

    return (
      <Card>
        <CardItem header>
          <Text>Igreja</Text>
        </CardItem>
        {loading &&
          <CardItem>
            <Body style={theme.alignCenter}>
              <Spinner />
            </Body>
          </CardItem>
        }
        {!loading && !church &&
          <CardItem style={theme.alignCenter}>
            <Text note>Não conseguimos atualizar</Text>
          </CardItem>
        }
        {!loading && church &&
          <View>
            {!!church.phone &&
              <CardItem button onPress={() => this.openPhone()}>
                <Icon name='call' />
                <Text>{phoneFormatter(church.phone)}</Text>
              </CardItem>
            }
            {!!church.address &&
              <CardItem button onPress={() => this.openAddress()}>
                <Icon name='pin' />
                <Text style={theme.cardItemMultiline}>
                  {church.address}
                </Text>
              </CardItem>
            }
            <CardItem footer style={theme.alignRight}>
              <Button transparent onPress={() => this.navigate('Church')}>
                <Text>DETALHES</Text>
              </Button>
            </CardItem>
          </View>
        }

      </Card>
    );
  }
}

export default withNavigation(ChurchCard);