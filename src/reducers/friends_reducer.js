import {
  ACCEPT_FRIEND,
  ADDED_ME,
  ADD_FRIEND,
  SET_ALL_CONTACTS,
  SET_FRIENDS,
  SET_SENT_TO_ME,
  SET_USERS_NUMBERS
} from '../actions/types'

import { PERSIST_REHYDRATE } from 'redux-persist/lib/constants'
import _ from 'lodash'

const INITIAL_STATE = {
  myInfo: { name: '', number: '', avatar: '' },
  myFriends: [],
  addedMe: [],
  sentToMe: [],
  allContacts: [],
  usersNumbers: []
}

export default function(state = INITIAL_STATE, action) {
  switch (action.type) {
    case PERSIST_REHYDRATE:
      return action.payload.friends
    case SET_FRIENDS:
      return { ...state, myFriends: action.payload }
    case ACCEPT_FRIEND:
      return {
        ...state,
        myFriends: _.uniqBy([...state.myFriends, action.payload], 'number')
      }
    case ADD_FRIEND:
      return state
    case ADDED_ME:
      return { ...state, addedMe: _.uniqBy(action.payload, 'number') }
    case SET_SENT_TO_ME:
      return { ...state, sentToMe: action.payload }
    case SET_ALL_CONTACTS:
      return { ...state, allContacts: action.payload }
    case SET_USERS_NUMBERS:
      return { ...state, usersNumbers: action.payload }
    default:
      return state
  }
}
