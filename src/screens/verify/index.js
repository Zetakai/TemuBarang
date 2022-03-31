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
    Image,ToastAndroid,
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
        phoneNumber: '',
        phoneBox: '0',
        password: '',
        confirm:null,confirming:false,code:''
      };
    }
    componentDidMount(){
     }
   _verifyPhoneNumber=async(phoneNumber)=> {
        const confirmation = await auth().verifyPhoneNumber(phoneNumber);
       this.setState({confirm:confirmation});
       console.log(confirmation)
      }
      _confirmCode=async()=> {
          const {code,confirm}=this.state
        try {
          const credential = await auth.PhoneAuthProvider.credential(confirm.verificationId, code);
          await auth().currentUser.linkWithCredential(credential);
          
        } catch (error) {
          if (error.code == 'auth/invalid-verification-code') {
            console.log('Invalid code.');
          } else {
            console.log('Account linking error');
          }
        }
      }
    render() {
      const {phoneNumber, password,phoneBox,confirming,code} = this.state;
      
      return (
        <View style={{flex: 1, backgroundColor: 'white'}}>
          <View style={{  justifyContent:'center',flex:1/10,marginLeft:0,left:0}} >
          <Upvector color={'green'} />
          </View>
          <View style={{flex: 3 / 10,alignItems:'center', justifyContent: 'center'}}>
            <Text style={styles.pagetitle}>Verify Phone Number</Text>
          </View>
          <View style={{flex:6/10,alignItems: 'center'}}>
            {confirming==false?<View style={{marginBottom: 45}}>
              <Text style={{color: 'black'}}>Your Phone Number</Text>
              <TextInput
              keyboardType='phone-pad'
              placeholderTextColor={'grey'}
                style={{borderWidth:1,
                  borderColor: phoneBox == '0' ? 'black' : 'red',color:'grey'
                }}
                value={phoneNumber}
                placeholder="Enter phone number"
                onChangeText={value => this.setState({phoneNumber: value})}
              />
            </View>:<View style={{marginBottom: 45}}>
              <Text style={{color: 'black'}}>Confirmation Code</Text>
              <TextInput
              keyboardType='phone-pad'
              placeholderTextColor={'grey'}
                style={{borderWidth:1,
                  borderColor: phoneBox == '0' ? 'black' : 'red',color:'grey'
                }}
                value={code}
                placeholder="Enter code"
                onChangeText={value => this.setState({code: value})}
              />
            </View>}
            {confirming==false?<CButton title={'Verify'} onPress={() => {this._verifyPhoneNumber(phoneNumber);this.setState({confirming:true})}} />
          :<CButton title={'Verify'} onPress={() => {this._confirmCode()}} />
        }</View>
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
  