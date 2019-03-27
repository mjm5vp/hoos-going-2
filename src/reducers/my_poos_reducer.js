import _ from 'lodash';
import { PERSIST_REHYDRATE } from 'redux-persist/lib/constants';

import {
  SET_LOG_TYPE,
  ADD_POO,
  EDIT_POOS,
  IDENTIFY_STACK_LOCATION,
  INCREASE_UID,
  ADD_FRIEND
} from '../actions/types';

const INITIAL_STATE = {
  logType: 'normal',
  uid: 0,
  myPoos: [],
  selectedStackLocation: {},
  friends: []
};

export default function (state = INITIAL_STATE, action) {
  switch (action.type) {
    case PERSIST_REHYDRATE:
      return action.payload.pooReducer || [];
    case SET_LOG_TYPE:
      return { ...state, logType: action.payload };
    case INCREASE_UID:
      const uid = state.uid + 1;
      return { ...state, uid };
    case ADD_POO:
      return { ...state, myPoos: [...state.myPoos, action.payload] };
    case EDIT_POOS:
      return { ...state, myPoos: action.payload };
    case IDENTIFY_STACK_LOCATION:
      return { ...state, selectedStackLocation: action.payload };
    case ADD_FRIEND:
      return { ...state, friends: _.uniqBy([...state.friends, action.payload], 'number') };
    default:
      return state;
  }
}
