// import { combineReducers } from 'redux';
import input from './input_reducer';
import pooReducer from './my_poos_reducer';
import auth from './auth_reducer';
import friends from './friends_reducer';
import settings from './settings_reducer';

// export default combineReducers({
//   input,
//   pooReducer
// });

export default ({
 input, pooReducer, auth, friends, settings
});
