import React, {useEffect, Component} from 'react';
import {Alert} from 'react-native';
import {Provider} from 'react-redux';
import Router from './src/navigation';
import {PersistGate} from 'redux-persist/integration/react';
import {Persistor, Store} from './src/redux/store';
import messaging from '@react-native-firebase/messaging';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

// foreground
messaging().onMessage(async remoteMessage => {
  setInboxData(remoteMessage);
});

// background
messaging().setBackgroundMessageHandler(async remoteMessage => {
  setInboxData(remoteMessage);
});

const setInboxData = async remoteMessage => {
  console.log(remoteMessage);
  !remoteMessage.notification.android.imageUrl
    ? firestore()
        .collection('Notifications')
        .doc(auth().currentUser.uid)
        .set(
          {
            notifs: firestore.FieldValue.arrayUnion({
              title: remoteMessage.notification.title,
              body: remoteMessage.notification.body,
              img: null,
              sentTime: remoteMessage.sentTime,
              isRead: 0,
            }),
          },
          {merge: true},
        )
    : firestore()
        .collection('Notifications')
        .doc(auth().currentUser.uid)
        .set(
          {
            notifs: firestore.FieldValue.arrayUnion({
              title: remoteMessage.notification.title,
              body: remoteMessage.notification.body,
              img: remoteMessage.notification.android.imageUrl,
              sentTime: remoteMessage.sentTime,
              isRead: 0,
            }),
          },
          {merge: true},
        );
};

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
