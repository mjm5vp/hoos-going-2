import {
  SELECT_POO,
  SET_UID,
  CHANGE_DESCRIPTION_TEXT,
  CHANGE_DATETIME,
  SET_LOCATION,
  SET_SEND_TO_FRIENDS,
  FILL_INPUT,
  RESET_INPUT,
  SET_INPUT_TYPE
} from './types';

export const setInputType = (inputType) => {
  return {
    type: SET_INPUT_TYPE,
    payload: inputType
  };
};

export const setUID = (inputUID) => {
  return {
    type: SET_UID,
    payload: inputUID
  };
};

export const selectPoo = (pooName) => {
  return {
    type: SELECT_POO,
    payload: pooName
  };
};

export const updateDescription = ({ text }) => {
  return {
    type: CHANGE_DESCRIPTION_TEXT,
    payload: text
  };
};

export const updateDateTime = (datetime) => {
  return {
    type: CHANGE_DATETIME,
    payload: datetime
  };
};

export const setLocation = (location) => {
  return {
    type: SET_LOCATION,
    payload: location
  };
};

export const setSendToFriends = (friends) => {
  return {
    type: SET_SEND_TO_FRIENDS,
    payload: friends
  };
};

export const fillInput = ({ inputUID, currentPooName, description, datetime, location }) => {
  return {
    type: FILL_INPUT,
    payload: { inputUID, currentPooName, description, datetime, location }
  };
};

export const resetInput = () => {
  return {
    type: RESET_INPUT,
    payload: null
  };
};
