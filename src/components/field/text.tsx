import { Icon, Input, Item } from 'native-base';
import * as React from 'react';
import { StyleSheet } from 'react-native';

import { variables } from '../../theme';

const keyboardTypes: any = {
  text: 'default',
  email: 'email-address',
  number: 'numeric',
  phone: 'phone-pad',
  zipcode: 'numeric',
  document: 'default'
};

const masks: any = {
  zipcode: {
    maxlength: 9,
    apply: (value: string) => value.replace(/^(\d{0,5})(\d{0,3}).*/, '$1-$2').replace(/-$/, ''),
    clean: (value: string) => value.replace(/\D/gi, '').substr(0, 8)
  },
  phone: {
    maxlength: 15,
    apply: (value: string) => {
      if (!value) return;

      const regexp = value.length > 10 ?
        /^(\d{0,2})(\d{0,5})(\d{0,4}).*/ :
        /^(\d{0,2})(\d{0,4})(\d{0,4}).*/;

      const result = value.length > 2 ?
        '($1) $2-$3' : '($1$2$3';

      return value.replace(regexp, result).replace(/-$/, '');
    },
    clean: (value: string) => value.replace(/\D/gi, '').substr(0, 11)
  },
  document: {
    maxlength: 18,
    apply: (value: string) => {
      if (!value) return;

      const regexp = value.length > 11 ?
        /^(\d{0,2})(\d{0,3})(\d{0,3})(\d{0,4})(\d{0,2}).*/ :
        /^(\d{0,3})(\d{0,3})(\d{0,3})(\d{0,2}).*/;

      const result = value.length > 11 ?
        '$1.$2.$3/$4-$5' : '$1.$2.$3-$4';

      return value
        .replace(regexp, result)
        .replace(/[-.\\]$/, '')
        .replace(/[-.\\]$/, '')
        .replace(/[-.\\]$/, '');
    },
    clean: (value: string) => value.replace(/\D/gi, '').substr(0, 18)
  }
};

interface IProps {
  type: string;
  next: () => any;
  hasError: boolean;
  value: any;
  placeholder: string;
  onChange: (value: any) => void;
  style?: any;
}

export class FieldText extends React.Component<IProps> {
  private input: Input;

  constructor(props: any) {
    super(props);
  }

  public onChange(value: string): void {
    value = this.cleanValue(value);
    this.props.onChange(value);
  }

  public cleanValue(value: string): string {
    const mask = masks[this.props.type];
    return mask ? mask.clean(value) : value;
  }

  public focus(): void {
    if (this.input) {
      (this.input as any)._root.focus();
      return;
    }
  }

  public render(): JSX.Element {
    const { type, next, hasError, value, placeholder, style } = this.props;

    const mask = masks[this.props.type];
    const maxlength = mask ? mask.maxlength : null;
    const maskedValue = mask ? mask.apply(value || '') : value;

    return (
      <Item style={StyleSheet.flatten([(style || {}).item, hasError ? { borderColor: variables.inputErrorBorderColor } : null])} error={hasError}>
        <Input
          placeholder={placeholder}
          ref={i => this.input = i}
          value={(maskedValue || '').toString()}
          onChangeText={value => this.onChange(value)}
          keyboardType={keyboardTypes[type] || keyboardTypes.text}
          secureTextEntry={type === 'password' ? true : false}
          style={styles.input}
          returnKeyType={next ? 'next' : 'default'}
          maxLength={maxlength}
          onSubmitEditing={() => next()}
        />
        {hasError && <Icon name='close-circle' />}
      </Item>
    );
  }
}

const styles = StyleSheet.create({
  input: {
    height: 40,
    lineHeight: 20,
    paddingLeft: 0
  }
});