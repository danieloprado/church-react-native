import { Body, Button, Header, Icon, Left, Picker, Right, Title, View } from 'native-base';
import * as React from 'react';
import { StyleSheet } from 'react-native';

import { variables } from '../../theme';

interface IProps {
  label?: string;
  type: 'dropdown' | 'dialog';
  value: any;
  options?: { value: string, display: string }[];
  onChange: (value: any) => void;
}

export function FieldPicker(props: IProps): JSX.Element {
  const { label, type, value, options, onChange } = props;

  return (
    <View style={styles.pickerContainer}>
      <Picker style={styles.picker}
        iosHeader={label}
        mode={type}
        prompt={label}
        selectedValue={value}
        renderHeader={(backAction: any) =>
          <Header>
            <Left>
              <Button transparent onPress={backAction}>
                <Icon name='close' />
              </Button>
            </Left>
            <Body>
              <Title>{label}</Title>
            </Body>
            <Right />
          </Header>
        }
        onValueChange={value => onChange(value)}>
        {options.map((option, i) =>
          <Picker.Item key={i} label={option.display} value={option.value} />
        )}
      </Picker>
    </View>
  );
}

const styles = StyleSheet.create({
  pickerContainer: {
    borderWidth: variables.borderWidth * 2,
    borderTopWidth: 0,
    borderRightWidth: 0,
    borderLeftWidth: 0,
    borderColor: variables.inputBorderColor,
    flex: 1,
    alignItems: 'stretch'
  },
  picker: {
    width: variables.deviceWidth - 20,
    paddingLeft: 0
  }
});