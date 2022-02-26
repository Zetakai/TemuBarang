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
      password: '',
    };
  }
  _userLogin = async () => {
    if (this.state.email === '' || this.state.password === '') {
      Alert.alert('Enter your email and password to log in');
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
          console.log(error)
          if(error.code=="auth/invalid-email")Alert.alert("Enter a correct email address")
          if(error.code=="auth/wrong-password")Alert.alert("You have entered an invalid username or password")
          if(error.code=="auth/user-not-found")Alert.alert("You are not registered yet")
        });
    }
  };

  render() {
    const {email, password} = this.state;
    return (
      <View style={{flex: 1, backgroundColor: 'white'}}>
        <View style={{flex: 1 / 2, justifyContent: 'center'}}>
          <Text style={styles.pagetitle}>Sign In</Text>
        </View>
        <View style={{alignItems: 'center'}}>
          <View style={{marginBottom: 25}}>
            <Text style={{color: 'black'}}>Your Email</Text>
            <CTextInput
              value={email}
              placeholder="Enter email"
              onChangeText={value => this.setState({email: value})}
            />
          </View>
          <View style={{marginBottom: 50}}>
            <Text style={{color: 'black'}}>Your Password</Text>
            <CTextInput
              value={password}
              placeholder="Enter password"
              onChangeText={value => this.setState({password: value})}
              secureTextEntry={true}
            />
          </View>
          <CButton title={'Login'} onPress={() => this._userLogin()} />
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
