import {connect} from 'react-redux';
import auth from '@react-native-firebase/auth'
const initialState = {
  user:{},
  notif:[],
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
      case 'ADD-NOTIF':
        return {
          ...state,
          notif: [action.payload, ...state.notif].slice(0,30)
        };
        case 'DELETE-NOTIF':
        return {
          ...state,
          notif: [],
        };
    default:
      return state;
  }
};
export default reducer;
