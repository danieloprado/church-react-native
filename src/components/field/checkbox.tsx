import { Body, CheckBox, ListItem, Text } from 'native-base';
import * as React from 'react';
import { StyleSheet } from 'react-native';

interface IProps {
  label?: string;
  value: any;
  onChange: (value: any) => void;
}

export function FieldCheckbox(props: IProps): JSX.Element {
  const { label, value, onChange } = props;

  return (
    <ListItem first last button onPress={() => onChange(!value)} style={styles.listItem} >
      <CheckBox checked={value} onPress={() => onChange(!value)} />
      <Body>
        <Text>{label}</Text>
      </Body>
    </ListItem>
  );
}

const styles = StyleSheet.create({
  listItem: {
    paddingLeft: 20
  }
});