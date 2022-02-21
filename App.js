import React, {useEffect, Component} from 'react';
import {Alert} from 'react-native';
import {Provider} from 'react-redux';
import Router from './src/navigation';
import {PersistGate} from 'redux-persist/integration/react';
import {Persistor, Store} from './src/redux/store';
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
