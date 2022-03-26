import {
  Linking,
  View,
  Text,
  ToastAndroid,
  TextInput,
  StyleSheet,
  ScrollView,
  Button,
  TouchableOpacity,
  Alert,
  ImageBackground,
  Image,
  ActivityIndicator,
  Modal,
} from 'react-native';
import React, {Component} from 'react';
import CInput from '../../components/atoms/Cinput';
import CButton from '../../components/atoms/CButton';
import auth from '@react-native-firebase/auth';
import Upvector from '../../assets/Vector9.svg';
import {connect} from 'react-redux';

export class LoginScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      emailBox: '0',
      password: '',
      passwordBox: '0',
      showForgot: '0',
      showRegister: '0',
      modalVisible: false,
      loadingColor: 'red',
    };
  }
  _userLogin = async () => {
    if (this.state.email === '' || this.state.password === '') {
      ToastAndroid.show(
        'Enter your email and password to log in',
        ToastAndroid.SHORT,
      );
      this.setState({emailBox: '1', passwordBox: '1'});
    } else {
      await auth()
        .signInWithEmailAndPassword(this.state.email, this.state.password)

        .then(res => {
          console.log(res);
          if (auth().currentUser.emailVerified == true) {
            console.log('User logged-in successfully!');
            ToastAndroid.show(`You're Logged in`, ToastAndroid.SHORT);
            this._setModalVisible(true);
            setTimeout(() => {
              this.setState({loadingColor: 'purple'});
              setTimeout(() => {
                this.props.login(res.user);
                this.props.navigation.reset({
                  index: 0,
                  routes: [{name: 'TabNav'}],
                });
              }, 1000);
            }, 1000);
          }
          if (auth().currentUser.emailVerified == false) {
            ToastAndroid.show(
              'Your email has not been verified. Please check your email!',
              ToastAndroid.SHORT,
            );
          }
        })
        .catch(error => {
          console.log(error);
          if (error.code == 'auth/invalid-email') {
            ToastAndroid.show(
              'Enter a correct email address!',
              ToastAndroid.SHORT,
            );
            this.setState({emailBox: '1'});
            this.setState({passwordBox: '0'});
          }
          if (error.code == 'auth/user-not-found') {
            ToastAndroid.show(
              'You are not registered yet.',
              ToastAndroid.SHORT,
            );
            this.setState({showRegister: '1'});
            this.setState({emailBox: '1'});
            this.setState({passwordBox: '0'});
          }
          if (error.code == 'auth/wrong-password') {
            ToastAndroid.show(
              'You have entered an invalid username or password.',
              ToastAndroid.SHORT,
            );
            this.setState({showForgot: '1'});
            this.setState({passwordBox: '1'});
            this.setState({emailBox: '0'});
          }
          if (error.code == 'auth/too-many-requests') {
            ToastAndroid.show(
              'Too many failed login attempts. Try again later!',
              ToastAndroid.SHORT,
            );
          }
        });
    }
  };
  _setModalVisible = visible => {
    this.setState({modalVisible: visible});
  };
  render() {
    const {
      email,
      password,
      emailBox,
      passwordBox,
      showForgot,
      showRegister,
      modalVisible,
    } = this.state;
    return (
      <View style={{flex: 1, backgroundColor: '#D4CEC6'}}>
        <View
          style={{
            justifyContent: 'center',
            flex: 1 / 10,
            marginLeft: 0,
            left: 0,
          }}>
          <Upvector color={'green'} />
        </View>

        <View style={{flex: 3 / 10, justifyContent: 'center'}}>
          <Text style={styles.pagetitle}>Sign In</Text>
        </View>
        <View
          style={{
            flex: 6 / 10,
            alignItems: 'center',
            justifyContent: 'flex-start',
          }}>
          <View style={{marginBottom: 20}}>
            <Text style={{color: 'black'}}>Your Email</Text>
            <CInput
              style={{
                ...styles.button,
                borderColor: emailBox == '0' ? 'black' : 'red',
              }}
              value={email}
              placeholder="Enter email"
              onChangeText={value => this.setState({email: value})}
            />
          </View>
          <View style={{marginBottom: 40}}>
            <Text style={{color: 'black'}}>Your Password</Text>
            <CInput
              style={{
                ...styles.button,
                borderColor: passwordBox == '0' ? 'black' : 'red',
              }}
              value={password}
              placeholder="Enter password"
              onChangeText={value => this.setState({password: value})}
              secureTextEntry={true}
            />
          </View>
          <CButton
            style={{marginBottom: 10, backgroundColor: '#AFA69F'}}
            title={'Login'}
            onPress={() => this._userLogin()}
          />

          <View style={{alignItems: 'center'}}>
            {showForgot == '1' || showRegister == '1' ? (
              <Text style={{color: 'black', marginBottom: 10}}>or</Text>
            ) : (
              <View></View>
            )}
            {showRegister == '1' ? (
              <CButton
                style={{...styles.button, marginBottom: 5}}
                title={'Create New Account.'}
                onPress={() => this.props.navigation.navigate('RegisterScreen')}
              />
            ) : (
              <View></View>
            )}
            {showForgot == '1' ? (
              <CButton
                style={{...styles.button}}
                title={'Reset Your Password.'}
                onPress={() =>
                  this.props.navigation.navigate('ForgotScreen', {
                    passEmail: email,
                  })
                }
              />
            ) : (
              <View></View>
            )}
          </View>
        </View>
        <Modal
          animationType="fade"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            this._setModalVisible(!modalVisible);
          }}>
          <View
            style={{
              height: '33%',
              marginTop: 'auto',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <ActivityIndicator size="large" color={this.state.loadingColor} />
          </View>
        </Modal>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  pagetitle: {
    marginLeft: 50,
    fontSize: 30,
    fontWeight: 'bold',
    color: '#0B7B86',
    shadowRadius: 2,
  },
  button: {width: 300, borderRadius: 15, borderColor: '#AFA69F'},
});
const mapStateToProps = state => {
  return {
    user: state.user,
  };
};
const mapDispatchToProps = dispatch => {
  return {
    login: data => {
      dispatch({
        type: 'LOGIN-USER',
        payload: data,
      });
    },
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(LoginScreen);
