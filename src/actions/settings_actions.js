import { SET_MAP_TYPE } from './types';

export const setMapType = (mapType) => {
  return {
    type: SET_MAP_TYPE,
    payload: mapType
  };
};
