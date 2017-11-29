import { Spinner, View } from 'native-base';
import * as React from 'react';
import { Modal, StyleSheet } from 'react-native';

import { variables } from '../theme';
import { BaseComponent, IStateBase } from './base';

interface IState extends IStateBase {
  refs: string[];
}

interface IProps { }

export class Loader extends BaseComponent<IState, IProps> {
  constructor(props: IProps) {
    super(props);
    this.state = { refs: [] };
  }

  public show(ref: string): void {
    if (typeof ref !== 'string') {
      throw new Error('Loader.show needs a ref string value');
    }

    const { refs } = this.state;
    if (refs.includes(ref)) return;

    refs.push(ref);
    this.setState({ refs }, true);
  }

  public hide(ref: string): void {
    if (typeof ref !== 'string') {
      throw new Error('Loader.hide needs a ref string value');
    }

    const { refs } = this.state;
    const index = refs.indexOf(ref);
    if (index === -1) return;

    refs.splice(index, 1);
    this.setState({ refs }, true);
  }

  public render(): JSX.Element {
    return (
      <Modal
        animationType='fade'
        transparent={true}
        visible={!!this.state.refs.length}
        onRequestClose={() => { }}
      >
        <View style={StyleSheet.flatten(styles.container)}>
          <Spinner size='large' color={variables.platform === 'android' ? variables.accent : undefined} />
        </View>
      </Modal>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(0,0,0,0.4)',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    transform: [{ scale: 1.5 }]
  }
});