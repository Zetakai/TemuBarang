import {connect} from 'react-redux';
const initialState = {
  user:[]};
const reducer = (state = initialState, action) => {
  switch (action.type) {
    case 'LOGIN-USER':
      return {
        ...state,
        user: [action.payload],
      };
      case 'LOGOUT-USER':
      return {
        ...state,
        user: [],
      };
    default:
      return state;
  }
};
export default reducer;
