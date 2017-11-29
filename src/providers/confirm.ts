import { Alert } from 'react-native';
import { Observable } from 'rxjs';

export function confirm(title: string, message: string, okText: string = 'OK', cancelText: string = 'Cancelar'): Observable<boolean> {
  return Observable.of(true).switchMap(() => {
    const promise = new Promise<boolean>(resolve => {
      Alert.alert(title, message, [
        { text: cancelText, style: 'cancel', onPress: () => resolve(false) },
        { text: okText, onPress: () => resolve(true) }
      ], { onDismiss: () => resolve(false) });
    });

    return Observable.fromPromise(promise);
  });
}