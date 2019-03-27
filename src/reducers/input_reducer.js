import moment from 'moment'

import {
  SET_INPUT_TYPE,
  SET_UID,
  SELECT_POO,
  CHANGE_DESCRIPTION_TEXT,
  CHANGE_DATETIME,
  SET_LOCATION,
  FILL_INPUT,
  RESET_INPUT,
  SET_SEND_TO_FRIENDS
} from '../actions/types'

const initialTime = moment().format('HH:mm')
const initialDate = moment().format('YYYY-MM-DD')
const initialDatetime = `${initialDate}T${initialTime}`

const INITIAL_STATE = {
  inputType: 'new',
  inputUID: null,
  currentPooName: 'basketball',
  datetime: initialDatetime,
  description: '',
  location: {
    latitude: '',
    longitude: ''
  },
  sendToFriends: []
}

export default function(state = INITIAL_STATE, action) {
  switch (action.type) {
    case SET_INPUT_TYPE:
      return { ...state, inputType: action.payload }
    case SET_UID:
      return { ...state, inputUID: action.payload }
    case SELECT_POO:
      return { ...state, currentPooName: action.payload }
    case CHANGE_DESCRIPTION_TEXT:
      return { ...state, description: action.payload }
    case CHANGE_DATETIME:
      return { ...state, datetime: action.payload }
    case SET_LOCATION:
      return { ...state, location: action.payload }
    case SET_SEND_TO_FRIENDS:
      return { ...state, sendToFriends: action.payload }
    case FILL_INPUT:
      const {
        inputUID,
        currentPooName,
        description,
        datetime,
        location
      } = action.payload
      return {
        ...state,
        inputUID,
        currentPooName,
        description,
        datetime,
        location
      }
    case RESET_INPUT:
      return INITIAL_STATE
    default:
      return state
  }
}
