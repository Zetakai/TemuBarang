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
      phoneNumber: '',
      phoneBox: '0',
      password: '',
      confirm: null,
      confirming: false,
      code: '',
    };
  }
  componentDidMount() {}
  _verifyPhoneNumber = async phoneNumber => {
    const confirmation = await auth().verifyPhoneNumber(phoneNumber);
    this.setState({confirm: confirmation});
    console.log(confirmation);
  };
  _confirmCode = async () => {
    const {code, confirm} = this.state;
    try {
      const credential = await auth.PhoneAuthProvider.credential(
        confirm.verificationId,
        code,
      );
      await auth().currentUser.linkWithCredential(credential);
    } catch (error) {
      if (error.code == 'auth/invalid-verification-code') {
        console.log('Invalid code.');
      } else {
        console.log('Account linking error');
      }
    }
  };
  render() {
    const {phoneNumber, password, phoneBox, confirming, code} = this.state;

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
          <Text style={styles.pagetitle}>Verifikasi Nomor Telepon</Text>
        </View>
        <View style={{flex: 6 / 10, alignItems: 'center'}}>
          {confirming == false ? (
            <View style={{marginBottom: 45}}>
              <Text style={{color: 'black', marginBottom: 5}}>Nomor Telepon</Text>
              <TextInput
                keyboardType="phone-pad"
                placeholderTextColor={'grey'}
                style={{
                  borderWidth: 1,
                  width: 300,
                  borderColor: phoneBox == '0' ? 'black' : 'red',
                  color: 'black',
                  borderRadius: 5,
                  paddingLeft: 10
                }}
                value={phoneNumber}
                placeholder="+62..."
                onChangeText={value => this.setState({phoneNumber: {value}})}
              />
            </View>
          ) : (
            <View style={{marginBottom: 45}}>
              <Text style={{color: 'black'}}>Kode Konfirmasi</Text>
              <TextInput
                keyboardType="phone-pad"
                placeholderTextColor={'grey'}
                style={{
                  borderWidth: 1,
                  borderColor: phoneBox == '0' ? 'black' : 'red',
                  color: 'grey',
                }}
                value={code}
                placeholder="Masukan Kode"
                onChangeText={value => this.setState({code: value})}
              />
            </View>
          )}
          {confirming == false ? (
            <CButton
              title={'Verifikasi'}
              style={{height: 50, borderRadius: 10, backgroundColor: '#00ca74', borderColor: '#00ca74'}}
              onPress={() => {
                this._verifyPhoneNumber(phoneNumber);
                this.setState({confirming: true});
              }}
            />
          ) : (
            <CButton
              title={'Konfirmasi'}
              onPress={() => {
                this._confirmCode();
              }}
            />
          )}
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
