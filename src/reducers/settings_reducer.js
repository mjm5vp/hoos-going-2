import { PERSIST_REHYDRATE } from 'redux-persist/lib/constants';

import {
  SET_MAP_TYPE
} from '../actions/types';

const INITIAL_STATE = {
  mapType: 'standard'
};

export default function (state = INITIAL_STATE, action) {
  switch (action.type) {
    case PERSIST_REHYDRATE:
      return action.payload.settings || [];
    case SET_MAP_TYPE:
      return { ...state, mapType: action.payload };
    default:
      return state;
  }
}
