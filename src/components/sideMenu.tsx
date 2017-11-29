import { Text } from 'native-base';
import * as React from 'react';
import { Dimensions, Image, ScrollView, StyleSheet, View } from 'react-native';
import { NavigationScreenProps } from 'react-navigation';

import { IUserToken } from '../interfaces/userToken';
import * as services from '../services';
import { ITokenService } from '../services/interfaces/token';
import platform from '../theme/native-base/variables/platform';
import { BaseComponent, IStateBase } from './base';
import { DrawerNavigatorItems as DrawerItems } from './drawerItems';

const ROUTES_ROLES = [
  { key: 'ChurchReport', roles: ['churchReport'] },
  { key: 'Dev', roles: ['sysAdmin'] }
];

interface IState extends IStateBase {
  routes: any[];
}

export class SideMenu extends BaseComponent<IState, NavigationScreenProps<any>> {
  private tokenService: ITokenService;

  constructor(props: any) {
    super(props);

    this.tokenService = services.get('tokenService');
    this.state = { routes: [] };
  }

  public filterRoutes(user: IUserToken): any {
    const routes: { key: string }[] = (this.props.navigation.state as any).routes;

    if (!user) {
      return routes.filter(r => !ROUTES_ROLES.some(x => x.key === r.key));
    }

    return routes.filter(r => {
      const routeConfig = ROUTES_ROLES.filter(x => x.key === r.key)[0];
      return !routeConfig || user.canAccess(...routeConfig.roles);
    });
  }

  public componentDidMount(): void {
    this.tokenService.getUser()
      .logError()
      .bindComponent(this)
      .subscribe(user => {
        const routes = this.filterRoutes(user);
        this.setState({ routes });
      });
  }

  public render(): JSX.Element {
    const { routes } = this.state;

    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Image source={require('../images/logo.png')} style={styles.logo} />
          <Text style={styles.headerText}>ICB Sorocaba</Text>
        </View>
        <ScrollView>
          <DrawerItems {...this.props} routes={routes} />
        </ScrollView>
      </View>
    );
  }

}

const styles = StyleSheet.create({
  container: {
    height: Dimensions.get('window').height
  },
  header: {
    backgroundColor: platform.toolbarDefaultBg,
    // height: 200
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16
  },
  logo: {
    height: 80,
    width: 80,
    marginRight: 20
  },
  headerText: {
    fontSize: 20,
    color: platform.toolbarTextColor
  }
});