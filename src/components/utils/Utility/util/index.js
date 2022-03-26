import {Dimensions, ToastAndroid} from 'react-native';
import {widthMobileUI, heightMobileUI} from '../constant';

export const responsiveWidth = width => {
  return (Dimensions.get('window').width * width) / widthMobileUI;
};

export const responsiveHeight = height => {
  return (Dimensions.get('window').height * height) / heightMobileUI;
};

export const numberWithCommas = x => {
  var parts = x.toString().split('.');
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  return parts.join(',');
};

export const currencyFormat = num => {
  return '$' + num.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
};

export const toastAndroidCenter = msg => {
  ToastAndroid.showWithGravity(msg, ToastAndroid.SHORT, ToastAndroid.CENTER);
};

export const getUniqueCode = (oldDate, idMix) => {
  const hour = oldDate.getHours();
  const minute = oldDate.getMinutes();
  const year = oldDate.getFullYear();
  const month = oldDate.getMonth() + 1;
  const date = oldDate.getDate();

  return `${date}${month}${String(year).substr(2)}${hour}${minute}${idMix}`;
};
