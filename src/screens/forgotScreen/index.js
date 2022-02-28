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

export default class ForgotScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
    };
  }
  _userForgot = async () => {
    if (this.state.email === '') {
      Alert.alert('Enter your email and password to sign up');
    } else {
      auth()
        .sendPasswordResetEmail(this.state.email)
        .then(() => {
          Alert.alert('Please check your email...');
          this.props.navigation.navigate('OnboardScreen');
        })
        .catch(error => {
          console.log(error);
          if (error.code == 'auth/invalid-email')
            Alert.alert('Enter a correct email address');
          if (error.code == 'auth/wrong-password')
            Alert.alert('You have entered an invalid username or password');
          if (error.code == 'auth/user-not-found')
            Alert.alert('You are not registered yet');
        });
    }
  };

  render() {
    const {email, password} = this.state;
    return (
      <View style={{flex: 1, backgroundColor: 'white'}}>
        <View style={{flex: 1 / 2, justifyContent: 'center'}}>
          <Text style={styles.pagetitle}>Reset Password</Text>
        </View>
        <View style={{alignItems: 'center'}}>
          <View style={{marginBottom: 45}}>
            <Text style={{color: 'black'}}>Your Email</Text>
            <CTextInput
              value={email}
              placeholder="Enter email"
              onChangeText={value => this.setState({email: value})}
            />
          </View>
          <CButton title={'Reset'} onPress={() => this._userForgot()} />
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
