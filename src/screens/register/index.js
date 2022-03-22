import {
  Linking,
  View,ToastAndroid,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  Button,
  TouchableOpacity,
  Alert,
  ImageBackground,
  Image,
} from 'react-native';
import React, {Component} from 'react';
import CTextInput from '../../components/atoms/CTextInput';
import CButton from '../../components/atoms/CButton';
import auth from '@react-native-firebase/auth';
import Upvector from '../../assets/Vector9.svg'

export default class RegisterScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      emailBox: '0',
      password: '',
      passwordBox: '0',
    };
  }
  _userSignup = async () => {
    if (this.state.email === '' || this.state.password === '') {
     ToastAndroid.show('Enter your email and password to sign up', ToastAndroid.SHORT);
      this.setState({emailBox: '1', passwordBox: '1'});
    } else {
     await auth()
        .createUserWithEmailAndPassword(this.state.email, this.state.password)
        .then((result)=>{
          result.user.sendEmailVerification()})
        .then(() => {
         ToastAndroid.show('Your account is created and check your email for verification!', ToastAndroid.SHORT);
          this.props.navigation.navigate('LoginScreen');
        })
        .catch(error => {
          console.log(error);
          if (error.code === 'auth/email-already-in-use') {
           ToastAndroid.show('That email address is already in use!', ToastAndroid.SHORT);
            this.setState({emailBox: '1'});
            this.setState({passwordBox: '0'});
          }
          if (error.code === 'auth/invalid-email') {
           ToastAndroid.show('That email address is invalid!', ToastAndroid.SHORT);
            this.setState({emailBox: '1'});
            this.setState({passwordBox: '0'});
          }
          if (error.code === 'auth/weak-password') {
           ToastAndroid.show('Password should be at least 6 characters.', ToastAndroid.SHORT);
            this.setState({passwordBox: '1'});
            this.setState({emailBox: '0'});
          }
        });
    }
  };

  render() {
    const {email, password,emailBox,passwordBox} = this.state;
    return (
      <View style={{flex: 1, backgroundColor: '#201C1B'}}>
         <View style={{  justifyContent:'center',flex:1/10,marginLeft:0,left:0}} >
        <Upvector color={'green'}/>
        </View>
        <View style={{flex: 3 / 10, justifyContent: 'center'}}>
          <Text style={styles.pagetitle}>Sign Up</Text>
        </View>
        <View style={{flex:6/10, alignItems: 'center'}}>
          <View style={{marginBottom: 25}}>
            <Text style={{color: 'black'}}>Your Email</Text>
            <CTextInput
              style={{
                borderColor: emailBox == '0' ? 'black' : 'red',
              }}
              value={email}
              placeholder="Enter email"
              onChangeText={value => this.setState({email: value})}
            />
          </View>
          <View style={{marginBottom: 45}}>
            <Text style={{color: 'black'}}>Your Password</Text>
            <CTextInput
              style={{
                borderColor: passwordBox == '0' ? 'black' : 'red',
              }}
              value={password}
              placeholder="Enter password"
              onChangeText={value => this.setState({password: value})}
              secureTextEntry={true}
            />
          </View>
          <CButton title={'Register'} onPress={() => this._userSignup()} />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  pagetitle: {
    marginLeft: 50,
    fontSize: 30,
    fontWeight: 'bold',
    color: '#D4CEC6',
  },
});
