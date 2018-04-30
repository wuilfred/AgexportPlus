import { createStore, applyMiddleware } from 'redux';
import { persistStore, persistReducer } from 'redux-persist'
import { AsyncStorage } from 'react-native';
import logger from 'redux-logger';

import reducers from '../reducers';

const middleware = [];
if(process.env.NODE_ENV === 'development'){
    middleware.push(logger);
}

const persistConfig = {
  key: 'root',
  storage: AsyncStorage
}
const persistedReducer = persistReducer(persistConfig, reducers)

export default createStore(persistedReducer, applyMiddleware(...middleware));