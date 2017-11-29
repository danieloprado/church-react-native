import { ActionSheet, Button, Icon } from 'native-base';
import * as propTypes from 'prop-types';
import * as React from 'react';
import { findNodeHandle, Platform, UIManager } from 'react-native';

import * as services from '../services';
import { ILogService } from '../services/interfaces/log';

interface IProps {
  actions: {
    display: string;
    onPress: () => void;
  }[];
  [key: string]: any;
}

export class PopupMenu extends React.Component<IProps> {
  public static propTypes: any = { actions: propTypes.array.isRequired };

  private logService: ILogService;

  constructor(props: any) {
    super(props);
    this.logService = services.get('logService');
  }

  public showMenu(): void {
    const { actions } = this.props;

    if (Platform.OS === 'ios') {
      ActionSheet.show({
        options: [...actions, { display: 'Cancelar' }].map(a => a.display),
        cancelButtonIndex: actions.length,
        title: 'Selecione'
      }, buttonIndex => {
        if (!actions[buttonIndex]) return;
        actions[buttonIndex].onPress();
      });
      return;
    }

    (UIManager as any).showPopupMenu(
      findNodeHandle(this.refs.menu as any),
      actions.map((a: any) => a.display),
      (err: any) => this.logService.handleError(err),
      (event: string, buttonIndex: number) => {
        if (event !== 'itemSelected') return;
        actions[buttonIndex].onPress();
      },
    );
  }

  public render(): JSX.Element {
    const props = this.props;
    delete (props as any).onPress;

    return (
      <Button {...props} onPress={() => this.showMenu()} ref='menu'>
        <Icon name='more' />
      </Button>
    );
  }
}