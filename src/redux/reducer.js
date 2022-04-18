import {connect} from 'react-redux';
import auth from '@react-native-firebase/auth'
const initialState = {
  user:{},
};
const reducer = (state = initialState, action) => {
  switch (action.type) {
    case 'LOGIN-USER':
      return {
        ...state,
        user: action.payload,
      };
      case 'LOGOUT-USER':
      return {
        ...state,
        user: {},
      };
      case 'UPDATE-USER':
      return {
        ...state,
        user: auth().currentUser,
      };
    default:
      return state;
  }
};
export default reducer;
