import {
    SET_CURRENT_USER,
    USER_LOADING
  } from "../actions/types";
  const isEmpty = require("is-empty");
  const initialState = {
    isAuthenticated: false,
    user: {},
    loading: false
  };
  export default function(state = initialState, action) {
    //Take actions depending on type
    switch (action.type) {
      //If current action is SET_CURRENT_USER
      //Set isAuthenictated and user to current user
      case SET_CURRENT_USER:
        return {
          ...state,
          isAuthenticated: !isEmpty(action.payload),
          user: action.payload
        };
      case USER_LOADING:
        return {
          ...state,
          loading: true
        };
      default:
        return state;
    }
  }