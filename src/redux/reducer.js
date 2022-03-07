import {connect} from 'react-redux';
const initialState = {
  userNow:[]};
const reducer = (state = initialState, action) => {
  switch (action.type) {
    case 'ADD-PROFILE':
      return {
        ...state,
        userNow: [...state.userNow, action.payload],
      };
      case 'DELETE-PROFILE':
      return {
        ...state,
        userNow: [],
      };
    default:
      return state;
  }
};
export default reducer;
