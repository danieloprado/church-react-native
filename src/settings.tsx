export const env = __DEV__ ? 'development' : 'production';
export const isDevelopment = env === 'development';

export const churchSlug = 'icb-sorocaba';
export const defaultAddress = {
  state: 'SP',
  city: 'Sorocaba'
};

export const apiTimeout = 15 * 1000;
export const apiEndpoint = env === 'production' ?
  `https://xxxx/api/app/${churchSlug}` :
  `http://192.168.25.3:3001/api/app/${churchSlug}`;

export const googleApi = {
  iosClientid: 'xxxx',
  webClientId: 'xxxx'
};