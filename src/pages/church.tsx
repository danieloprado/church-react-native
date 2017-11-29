import {
  Body,
  Button,
  Container,
  Content,
  H2,
  Header,
  Icon,
  Left,
  List,
  ListItem,
  Right,
  Spinner,
  Text,
  Title,
  View,
} from 'native-base';
import * as React from 'react';
import { Image, Linking, StyleSheet } from 'react-native';
import { NavigationDrawerScreenOptions } from 'react-navigation';

import { BaseComponent, IStateBase } from '../components/base';
import { ErrorMessage } from '../components/errorMessage';
import { phoneFormatter } from '../formatters/phone';
import { IChurch } from '../interfaces/church';
import * as services from '../services';
import { IChurchSevice } from '../services/interfaces/church';
import { theme } from '../theme';

interface IState extends IStateBase {
  loading: boolean;
  church?: IChurch;
  error?: any;
}

export default class ChurchPage extends BaseComponent<IState> {
  public static navigationOptions: NavigationDrawerScreenOptions = {
    drawerLabel: 'Igreja' as any,
    drawerIcon: ({ tintColor }) => (
      <Icon name='information-circle' style={{ color: tintColor }} />
    )
  };

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
        this.setState({ loading: false, church, error: null });
      }, error => this.setState({ loading: false, error }));
  }

  public openPhone(): void {
    Linking.openURL(`tel:${this.state.church.phone}`);
  }

  public openAddress(): void {
    Linking.openURL(`geo:${this.state.church.latitude},${this.state.church.longitude}?q=${this.state.church.address}`);
  }

  public openEmail(): void {
    Linking.openURL(`mailto:${this.state.church.email}`);
  }

  public openUrl(url: string): void {
    Linking.openURL(url);
  }

  public render(): JSX.Element {
    const { church, loading, error } = this.state;

    return (
      <Container>
        <Header>
          <Left>
            <Button transparent onPress={() => this.openDrawer()}>
              <Icon name='menu' />
            </Button>
          </Left>
          <Body>
            <Title>{church ? church.name : 'Igreja'}</Title>
          </Body>
          <Right />
        </Header>
        <Content>
          {loading && <Spinner />}
          {!loading && !!error &&
            <ErrorMessage error={error} />
          }
          {!loading && !error && church &&
            <View style={styles.container}>
              <View style={theme.alignCenter}>
                <Image source={require('../images/logo.png')} style={styles.logo} />
                <H2 style={styles.headerText}>{church.name}</H2>
              </View>
              <List style={styles.list}>
                {!!church.phone &&
                  <ListItem
                    button
                    onPress={() => this.openPhone()}
                    style={styles.listItem}>
                    <Left style={theme.listIconWrapper}>
                      <Icon name='call' style={theme.listIcon} />
                    </Left>
                    <Body>
                      <Text>{phoneFormatter(church.phone)}</Text>
                    </Body>
                  </ListItem>
                }
                {!!church.email &&
                  <ListItem
                    button
                    onPress={() => this.openEmail()}
                    style={styles.listItem}>
                    <Left style={theme.listIconWrapper}>
                      <Icon name='mail' style={theme.listIcon} />
                    </Left>
                    <Body>
                      <Text>{church.email}</Text>
                    </Body>
                  </ListItem>
                }
                {!!church.address &&
                  <ListItem
                    button
                    onPress={() => this.openAddress()}
                    style={styles.listItem}>
                    <Left style={theme.listIconWrapper}>
                      <Icon name='pin' style={theme.listIcon} />
                    </Left>
                    <Body>
                      <Text>{church.address}</Text>
                    </Body>
                  </ListItem>
                }
                {church.social.map(social => {
                  const icons: any = { facebook: 'logo-facebook', youtube: 'logo-youtube' };
                  const icon = icons[social.name] || 'globe';

                  return (
                    <ListItem
                      key={social.name}
                      button
                      onPress={() => this.openUrl(social.url)}
                      style={styles.listItem}>
                      <Left style={theme.listIconWrapper}>
                        <Icon name={icon} style={theme.listIcon} />
                      </Left>
                      <Body>
                        <Text>{social.name === 'website' ? social.url : social.name.toUpperCase()}</Text>
                      </Body>
                    </ListItem>
                  );
                })}
              </List>
            </View>
          }
        </Content>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 20,
    paddingBottom: 20
  },
  logo: {
    height: 120,
    width: 120,
    marginBottom: 30
  },
  headerText: {
    opacity: 0.6
  },
  list: {
    marginTop: 30
  },
  listItem: {
    borderBottomWidth: 0
  }
});