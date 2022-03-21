import {connect} from 'react-redux';
const initialState = {
  user:[]};
const reducer = (state = initialState, action) => {
  switch (action.type) {
    case 'ADD-PROFILE':
      return {
        ...state,
        user: [...state.user, action.payload],
      };
      case 'DELETE-PROFILE':
      return {
        ...state,
        user: [],
      };
    default:
      return state;
  }
};
export default reducer;
