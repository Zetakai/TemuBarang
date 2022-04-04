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
  ToastAndroid,
} from 'react-native';
import React, {Component} from 'react';
import CTextInput from '../../components/atoms/CTextInput';
import CButton from '../../components/atoms/CButton';
import auth from '@react-native-firebase/auth';
import Upvector from '../../assets/Vector9.svg';
import Back from 'react-native-vector-icons/FontAwesome5';
export default class ForgotScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      emailBox: '0',
      password: '',
    };
  }
  componentDidMount() {
    const {passEmail} = this.props.route.params;
    passEmail && this.setState({email: passEmail});
  }

  _userForgot = async () => {
    if (this.state.email === '') {
      ToastAndroid.show('Enter your email', ToastAndroid.SHORT);
      this.setState({emailBox: '1'});
    } else {
      await auth()
        .sendPasswordResetEmail(this.state.email)
        .then(() => {
          ToastAndroid.show('Please check your email...', ToastAndroid.SHORT);
          this.props.navigation.navigate('OnboardScreen');
        })
        .catch(error => {
          console.log(error);
          if (error.code == 'auth/invalid-email') {
            ToastAndroid.show(
              'Enter a correct email address!',
              ToastAndroid.SHORT,
            );
            this.setState({emailBox: '1'});
          }
          if (error.code == 'auth/user-not-found') {
            ToastAndroid.show(
              'You are not registered yet.',
              ToastAndroid.SHORT,
            );
            this.setState({emailBox: '1'});
          }
        });
    }
  };

  render() {
    const {email, password, emailBox} = this.state;

    return (
      <View style={{flex: 1, backgroundColor: 'white'}}>
        <View
          style={{
            justifyContent: 'center',
            flex: 1 / 10,
            marginLeft: 0,
            left: 0,
          }}>
          <Upvector color={'green'} />
        </View>
        <TouchableOpacity style={{position: 'absolute', top: 10, left: 10}}>
          <View
            style={{
              backgroundColor: 'white',
              borderRadius: 100,
              height: 40,
              width: 40,
              justifyContent: 'center',
              alignItems: 'center',
              shadowColor: 'black',
              elevation: 5,
            }}>
            <Back
              name="arrow-left"
              color={'black'}
              size={22}
              onPress={() => this.props.navigation.goBack()}
            />
          </View>
        </TouchableOpacity>
        <View
          style={{
            flex: 3 / 10,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Text style={styles.pagetitle}>Reset Password</Text>
        </View>
        <View style={{flex: 6 / 10, alignItems: 'center'}}>
          <View style={{marginBottom: 45}}>
            <Text style={{color: 'black'}}>Email Anda</Text>
            <CTextInput
              style={{
                borderWidth: 1,
                borderColor: emailBox == '0' ? 'black' : 'red',
              }}
              value={email}
              placeholder="Enter email"
              onChangeText={value => this.setState({email: value})}
            />
          </View>
          <CButton
            title={'Reset'}
            style={{
              height: 50,
              borderRadius: 10,
              backgroundColor: '#00ca74',
              borderColor: '#00ca74',
            }}
            onPress={() => this._userForgot()}
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  pagetitle: {
    fontSize: 30,
    fontWeight: 'bold',
    color: 'green',
  },
});
