import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
// import logger from 'redux-logger';
import { persistStore, persistCombineReducers, createTransform, } from 'redux-persist';
import { AsyncStorage } from 'react-native';
import moment from 'moment';
import reducers from '../reducers';

const testTransform = createTransform(null, (incomingState) => {
  console.log('incomingState');
  console.log(incomingState);

  if (incomingState.myPoos) {
    const newIncomingState = incomingState;
    const newPoos = incomingState.myPoos.map(poo => {
      const newDatetime = moment(poo.datetime);
      const newPoo = poo;
      newPoo.datetime = newDatetime;
      return newPoo;
    });
    newIncomingState.myPoos = newPoos;
    return newIncomingState;
  }

  return incomingState;
});

const config = {
 key: 'root',
 storage: AsyncStorage,
 // transforms: [adfadf],
 whitelist: ['pooReducer', 'auth', 'friends']
};

const reducer = persistCombineReducers(config, reducers);

export default function configureStore() {
 const store = createStore(
     reducer,
     {},
     applyMiddleware(thunk)
 );

 const persistor = persistStore(store);
 return { persistor, store };
}
