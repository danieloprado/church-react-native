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
import { Image, StyleSheet } from 'react-native';
import { NavigationDrawerScreenOptions } from 'react-navigation';

import { BaseComponent, IStateBase } from '../../components/base';
import { ErrorMessage } from '../../components/errorMessage';
import { dateFormatter } from '../../formatters/date';
import { IUser } from '../../interfaces/user';
import { confirm } from '../../providers/confirm';
import * as services from '../../services';
import { IProfileService } from '../../services/interfaces/profile';
import { theme, variables } from '../../theme';

interface IState extends IStateBase {
  loading: boolean;
  profile?: IUser;
  error?: any;
}

export default class ProfileDetailsPage extends BaseComponent<IState> {
  public static navigationOptions: NavigationDrawerScreenOptions = {
    drawerLabel: 'Perfil' as any,
    drawerIcon: ({ tintColor }) => (
      <Icon name='contact' style={{ color: tintColor }} />
    )
  };

  private profileService: IProfileService;

  constructor(props: any) {
    super(props);

    this.profileService = services.get('profileService');
    this.state = { loading: true };
  }

  public componentDidMount(): void {
    this.profileService.get()
      .logError()
      .bindComponent(this)
      .subscribe(profile => {
        this.setState({ loading: false, profile, error: false });
      }, error => this.setState({ loading: false, error }));
  }

  public logout(): void {
    confirm('Confirmar', 'Deseja realmente sair?', 'Sim', 'Não')
      .filter(ok => ok)
      .switchMap(() => this.profileService.logout().loader())
      .logError()
      .bindComponent(this)
      .subscribe();
  }

  public render(): JSX.Element {
    const { profile, loading, error } = this.state;
    let gender = null;

    if (profile) {
      switch (profile.gender) {
        case 'm':
          gender = 'Masculino';
          break;
        case 'f':
          gender = 'Feminino';
          break;
        default:
          gender = 'Não informado';
      }
    }

    return (
      <Container>
        <Header>
          <Left>
            <Button transparent onPress={() => this.openDrawer()}>
              <Icon name='menu' />
            </Button>
          </Left>
          <Body>
            <Title>Perfil</Title>
          </Body>
          <Right>
            {profile &&
              <Button transparent onPress={() => this.navigate('ProfileEdit', { profile })}>
                <Icon name='create' />
              </Button>
            }
          </Right>
        </Header>
        <Content>
          {loading && <Spinner />}
          {!loading && !profile && error &&
            <ErrorMessage error={error} />
          }
          {!loading && !profile && !error &&
            <View style={StyleSheet.flatten([theme.emptyMessage, theme.alignCenter])}>
              <Icon name='contact' style={StyleSheet.flatten([styles.loginIcon, theme.iconLarge])} />
              <Text style={styles.loginText}>Ainda não te conhecemos, mas gostaríamos de saber mais sobre você!</Text>
              <Button block onPress={() => this.navigate('Welcome', { force: true })}>
                <Text>ENTRAR</Text>
              </Button>
            </View>
          }
          {!loading && profile &&
            <View>
              <View style={styles.header}>
                {profile.avatar ?
                  <Image style={styles.avatarImg} source={{ uri: profile.avatar }} />
                  :
                  <Icon name='contact' style={styles.avatarIcon} />
                }
                <H2 style={styles.headerText}>{profile.fullName}</H2>
              </View>
              <List>
                {!!profile.email &&
                  <ListItem style={StyleSheet.flatten([theme.listItem, styles.listItem])}>
                    <Left style={theme.listIconWrapper}>
                      <Icon name='mail' style={theme.listIcon} />
                    </Left>
                    <Body>
                      <Text>{profile.email}</Text>
                    </Body>
                  </ListItem>
                }
                <ListItem style={StyleSheet.flatten([theme.listItem, styles.listItem])}>
                  <Left style={theme.listIconWrapper}>
                    <Icon name={profile.gender === 'f' ? 'female' : 'male'} style={theme.listIcon} />
                  </Left>
                  <Body>
                    <Text>{gender}</Text>
                  </Body>
                </ListItem>
                {!!profile.birthday &&
                  <ListItem style={StyleSheet.flatten([theme.listItem, styles.listItem])}>
                    <Left style={theme.listIconWrapper}>
                      <Icon name='calendar' style={theme.listIcon} />
                    </Left>
                    <Body>
                      <Text>{dateFormatter.formatBirthday(profile.birthday)}</Text>
                    </Body>
                  </ListItem>
                }
                {!!profile.fullAddress &&
                  <ListItem style={StyleSheet.flatten([theme.listItem, styles.listItem])}>
                    <Left style={theme.listIconWrapper}>
                      <Icon name='pin' style={theme.listIcon} />
                    </Left>
                    <Body>
                      <Text>{profile.fullAddress}</Text>
                    </Body>
                  </ListItem>
                }
              </List>
              <Button block light style={styles.logoutButton} onPress={() => this.logout()}>
                <Text>SAIR</Text>
              </Button>
            </View>
          }
        </Content>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  loginIcon: {
    marginTop: 20,
    marginBottom: 10,
    color: variables.accent
  },
  loginText: {
    textAlign: 'center',
    marginBottom: 20
  },
  header: {
    backgroundColor: variables.accent,
    padding: 16,
    justifyContent: 'center',
    alignItems: 'center'
  },
  headerText: {
    color: 'white'
  },
  headerNote: {
    color: 'white',
    opacity: 0.8
  },
  avatarImg: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
    borderColor: 'white',
    borderWidth: 2
  },
  avatarIcon: {
    marginBottom: 10,
    color: 'white',
    fontSize: 100
  },
  content: {
    padding: 16
  },
  list: {
    marginTop: 10
  },
  listItem: {
    borderBottomWidth: 0
  },
  logoutButton: {
    margin: 16
  }
});