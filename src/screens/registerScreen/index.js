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

export default class RegisterScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
    };
  }
  _userSignup = async () => {
    if (this.state.email === '' || this.state.password === '') {
      Alert.alert('Enter your email and password to sign up');
    } else {
      auth()
        .createUserWithEmailAndPassword(this.state.email, this.state.password)
        .then(() => {
          Alert.alert('User account created & signed in!');
          this.props.navigation.navigate('LoginScreen');
        })
        .catch(error => {
          if (error.code === 'auth/email-already-in-use') {
            Alert.alert('That email address is already in use!');
          }
          if (error.code === 'auth/invalid-email') {
            Alert.alert('That email address is invalid!');
          }
          if (error.code === 'auth/weak-password') {
            Alert.alert('Your password is weak. Try another ones');
          } else {
            console.error(error);
          }
        });
    }
  };

  render() {
    const {email, password} = this.state;
    return (
      <View style={{flex: 1, backgroundColor: 'white'}}>
        <View style={{flex: 1 / 3, justifyContent: 'center'}}>
          <Text style={styles.pagetitle}>Sign Up</Text>
        </View>
        <View style={{flex: 2 / 3, alignItems: 'center'}}>
          <View style={{marginBottom: 25}}>
            <Text style={{color: 'black'}}>Your Email</Text>
            <CTextInput
              value={email}
              placeholder="Enter email"
              onChangeText={value => this.setState({email: value})}
            />
          </View>
          <View style={{marginBottom: 45}}>
            <Text style={{color: 'black'}}>Your Password</Text>
            <CTextInput
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
    color: 'green',
  },
});
