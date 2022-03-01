import {
  Linking,
  View,
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

export default class LoginScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      emailBox: '0',
      password: '',
      passwordBox: '0',
      showForgot: '0',
    };
  }
  _userLogin = async () => {
    if (this.state.email === '' || this.state.password === '') {
      Alert.alert('Enter your email and password to log in');
      this.setState({emailBox: '1', passwordBox: '1'});
      setTimeout(() => {
        this.setState({emailBox: '0', passwordBox: '0'});
      }, 15000);
    } else {
      auth()
        .signInWithEmailAndPassword(this.state.email, this.state.password)
        .then(res => {
          console.log(res);
          console.log('User logged-in successfully!');
          Alert.alert(`You're Logged in`);
          // this.props.navigation.navigate('Dashboard')
        })
        .catch(error => {
          console.log(error);
          if (error.code == 'auth/invalid-email') {
            Alert.alert('Enter a correct email address');
            this.setState({emailBox: '1'});
            setTimeout(() => {
              this.setState({emailBox: '0'});
            }, 15000);
          }
          if (error.code == 'auth/user-not-found')
            Alert.alert('You are not registered yet');
          if (error.code == 'auth/wrong-password') {
            Alert.alert('You have entered an invalid username or password');
            this.setState({showForgot: '1'});
          }
        });
    }
  };

  render() {
    const {email, password} = this.state;
    return (
      <View style={{flex: 1, backgroundColor: 'white'}}>
        <View style={{flex: 1 / 3, justifyContent: 'center'}}>
          <Text style={styles.pagetitle}>Sign In</Text>
        </View>
        <View style={{flex: 2 / 3, alignItems: 'center'}}>
          <View style={{marginBottom: 25}}>
            <Text style={{color: 'black'}}>Your Email</Text>
            <CTextInput
              style={{
                ...styles.button,
                borderColor: this.state.emailBox == '0' ? 'black' : 'red',
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
                ...styles.button,
                borderColor: this.state.emailBox == '0' ? 'black' : 'red',
              }}
              value={password}
              placeholder="Enter password"
              onChangeText={value => this.setState({password: value})}
              secureTextEntry={true}
            />
          </View>
          <CButton
            style={{marginBottom: 20}}
            title={'Login'}
            onPress={() => this._userLogin()}
          />
          {this.state.showForgot == '1' ? (
            <View style={{alignItems: 'center'}}>
              <Text style={{color: 'black', marginBottom: 20}}>or</Text>
              <CButton
                style={styles.button}
                title={'Forgot Your Password?'}
                onPress={() => this.props.navigation.navigate('ForgotScreen')}
              />
            </View>
          ) : (
            <View></View>
          )}
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
    color: 'green',
  },
  button: {width: 300, borderRadius: 15},
});
