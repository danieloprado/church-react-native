import * as React from 'react';

import { EmptyMessage } from './emptyMessage';

interface IProps {
  error?: Error;
}

export function ErrorMessage(props: IProps): JSX.Element {
  let icon, message;

  switch ((props.error || { message: '' }).message) {
    case 'no-internet':
    case 'NETWORK_ERROR':
      icon = 'ios-wifi';
      message = 'Sem conexão com a internet';
      break;
    case 'api-error':
      icon = 'thunderstorm';
      message = 'Não conseguimos se comunicar com o servidor';
      break;
    default:
      icon = 'bug';
      message = 'Algo deu errado...';
  }

  return <EmptyMessage icon={icon} message={message} />;
}
