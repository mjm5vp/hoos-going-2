import firebase from 'firebase';
import {
  ADD_POO,
  EDIT_POOS,
  IDENTIFY_STACK_LOCATION,
  INCREASE_UID,
  SET_LOG_TYPE,
  ADD_FRIEND
} from './types';

export const setLogType = (logType) => {
  return {
    type: SET_LOG_TYPE,
    payload: logType
  };
};

export const addPoo = ({ inputUID, currentPooName, datetime, description, location }) => {
  const { currentUser } = firebase.auth();

  if (currentUser) {
    console.log('added poo to database');
    firebase.database().ref(`/users/${currentUser.uid}/myPoos/${inputUID}`)
      .update({ inputUID, currentPooName, datetime, description, location });
      // .push({inputUID, currentPooName, stringDatetime, description, location });
  }

  return {
    type: ADD_POO,
    payload: { inputUID, currentPooName, datetime, description, location }
  };
};

export const editPoos = (newPoos) => {
  const { currentUser } = firebase.auth();

  if (currentUser) {
    console.log('edited poos in database');
    firebase.database().ref(`/users/${currentUser.uid}`)
      .update({ myPoos: newPoos });
  }

  return {
    type: EDIT_POOS,
    payload: newPoos
  };
};

export const identifyStackLocation = (location) => {
  console.log('identifyStackLocation');
  return {
    type: IDENTIFY_STACK_LOCATION,
    payload: location
  };
};

export const increaseUID = () => {
  console.log('increaseUID');
  return {
    type: INCREASE_UID,
    payload: null
  };
};
