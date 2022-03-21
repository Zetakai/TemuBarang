import {createStore} from 'redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {persistStore, persistReducer} from 'redux-persist';
import reducer from './../../src/redux/reducer';

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: ['user', 'notif'],
  blacklist: [''],
  timeout: null,
};
const persistedReducer = persistReducer(persistConfig, reducer);
const Store = createStore(persistedReducer);
const Persistor = persistStore(Store);

export {Store, Persistor};
