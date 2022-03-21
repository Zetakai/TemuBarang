import React, {useEffect, Component} from 'react';
import {Alert} from 'react-native';
import {Provider} from 'react-redux';
import Router from './src/navigation';
import {PersistGate} from 'redux-persist/integration/react';
import {Persistor, Store} from './src/redux/store';
import messaging from '@react-native-firebase/messaging';

// foreground
messaging().onMessage(async remoteMessage => {
  setInboxData(remoteMessage)
});

// background
messaging().setBackgroundMessageHandler(async remoteMessage => {
  setInboxData(remoteMessage)
});

const setInboxData = async remoteMessage => {
  Store.dispatch({
    type: 'ADD-NOTIF',
    payload: 
      {
        title: remoteMessage.notification.title,
        body: remoteMessage.notification.body,
        img: remoteMessage.notification.android.imageUrl,
        sentTime: remoteMessage.sentTime,
        isRead: 0,
      },
    
  });
}

const App = () => {
  return (
    <Provider store={Store}>
      <PersistGate loading={null} persistor={Persistor}>
        <Router />
      </PersistGate>
    </Provider>
  );
};
export default App;
