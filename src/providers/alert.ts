import { Alert } from 'react-native';
import { Observable } from 'rxjs';

export function alert(title: string, message: string, okText: string = 'OK'): Observable<boolean> {
  return Observable.of(true).switchMap(() => {
    const promise = new Promise<boolean>(resolve => {
      setTimeout(() => {
        Alert.alert(title, message, [
          { text: okText, onPress: () => resolve(true) }
        ], { onDismiss: () => resolve(false) });
      }, 500);
    });

    return Observable.fromPromise(promise);
  });
}

export function alertError(err: any): Observable<boolean> {
  let message;
  const status: any = {
    '-1': 'Servidor não encontrado',
    400: 'Dados inválidos',
    401: 'Sem permissão de acesso',
    403: 'Sem permissão de acesso',
    422: 'Dados inválidos'
  };

  switch ((err || {}).message) {
    case 'no-internet':
    case 'NETWORK_ERROR':
      message = 'Sem conexão com a internet';
      break;
    case 'api-error':
      if (err.status == -1) {
        message = 'Não conseguimos se comunicar com o servidor';
        break;
      }

      message = status[err.status] || 'Algo deu errado...';
      break;
    default:
      message = 'Algo deu errado...';
  }

  return alert('Atenção', message);
}