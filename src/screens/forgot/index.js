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
import Upvector from '../../assets/Vector9.svg'
export default class ForgotScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      emailBox: '0',
      password: '',
    };
  }
  componentDidMount(){
    const {passEmail}=this.props.route.params;
    passEmail&&this.setState({email:passEmail})}
  _userForgot = async () => {
    if (this.state.email === '') {
      Alert.alert('Enter your email');
      this.setState({emailBox: '1'});
    } else {
     await auth()
        .sendPasswordResetEmail(this.state.email)
        .then(() => {
          Alert.alert('Please check your email...');
          this.props.navigation.navigate('OnboardScreen');
        })
        .catch(error => {
          console.log(error);
          if (error.code == 'auth/invalid-email') {
            Alert.alert('Enter a correct email address!');
            this.setState({emailBox: '1'});
          }
          if (error.code == 'auth/user-not-found') {
            Alert.alert('You are not registered yet.');
            this.setState({emailBox: '1'});
          }
        });
    }
  };

  render() {
    const {email, password,emailBox} = this.state;
    
    return (
      <View style={{flex: 1, backgroundColor: 'white'}}>
        <View style={{  justifyContent:'center',flex:1/10,marginLeft:0,left:0}} >
        <Upvector color={'green'} />
        </View>
        <View style={{flex: 3 / 10,alignItems:'center', justifyContent: 'center'}}>
          <Text style={styles.pagetitle}>Reset Password</Text>
        </View>
        <View style={{flex:6/10,alignItems: 'center'}}>
          <View style={{marginBottom: 45}}>
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
          <CButton title={'Reset'} onPress={() => this._userForgot()} />
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