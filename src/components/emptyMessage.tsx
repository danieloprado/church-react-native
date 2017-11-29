import { Button, Icon, Text, View } from 'native-base';
import * as propTypes from 'prop-types';
import * as React from 'react';
import { StyleSheet } from 'react-native';

import { variables } from '../theme';

interface IProps {
  icon: string;
  message: string;
  button?: string;
  onPress?: Function;
}

export function EmptyMessage(props: IProps): JSX.Element {
  return (
    <View padder style={styles.container}>
      <Icon name={props.icon} style={styles.icon} />
      <Text style={styles.message}>{props.message}</Text>
      {!!props.button &&
        <Button accent block style={styles.button} onPress={() => props.onPress()}>
          <Text>{props.button}</Text>
        </Button>
      }
    </View>
  );
}

(EmptyMessage as any).propTypes = {
  icon: propTypes.string.isRequired,
  message: propTypes.string.isRequired,
  button: propTypes.string,
  onPress: propTypes.func
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  icon: {
    marginTop: 90,
    fontSize: 100,
    color: variables.darkGray
  },
  message: {
    marginTop: 5,
    fontSize: 18,
    opacity: 0.5,
    textAlign: 'center'
  },
  button: {
    marginTop: 20
  }
});