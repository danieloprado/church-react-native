import { Toast } from 'native-base';
import { Platform, ToastAndroid } from 'react-native';

export function toast(text: string, duration: number = 5000): void {
  if (Platform.OS === 'android') {
    ToastAndroid.showWithGravity(text, duration < 5000 ? ToastAndroid.SHORT : ToastAndroid.LONG, ToastAndroid.BOTTOM);
    return;
  }

  Toast.show({
    text,
    position: 'bottom',
    buttonText: 'Ok',
    duration
  });
}