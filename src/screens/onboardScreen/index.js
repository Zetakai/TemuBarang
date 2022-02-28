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
import LoginScreen from '../loginScreen'

export default class OnboardScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
    };
  }

  render() {
    return (
      <View style={{flex: 1, backgroundColor: 'white'}}>
        <View style={{flex: 1 / 3, justifyContent: 'center'}}>
          <Text style={styles.pagetitle}>TemuBarang</Text>
        </View>
        <View style={{flex: 2 / 3,alignItems:'center'}}>
          <View style={{marginHorizontal: 50,marginBottom:50}}>
            <Text style={{color: 'black', fontSize: 20}}>What's Up!</Text>
            <Text style={{color: 'brown', fontSize: 18}}>
              Having trouble finding your own{' '}
              <Text style={{color: 'green'}}>lost stuff</Text> or you're a good
              person trying to{' '}
              <Text style={{color: 'green'}}>get someone's stuff back</Text> to
              its beloved owner? Why don't you check this{' '}
              <Text style={{color: 'green'}}>cool App</Text> out?{' '}
            </Text>
          </View>
          <View style={{alignItems: 'center'}}>
            <CButton
              style={{...styles.button, marginBottom: 15}}
              title={'Sign Up'}
              onPress={() => this.props.navigation.navigate('RegisterScreen')}
            />
            <CButton
              style={styles.button}
              title={'Sign In'}
              onPress={() => this.props.navigation.navigate('LoginScreen')}
            />
          </View>
        </View>
      </View>
    );
    <LoginScreen></LoginScreen>
  }
}

const styles = StyleSheet.create({
  pagetitle: {
    marginLeft: 50,
    fontSize: 40,
    fontWeight: 'bold',
    color: 'green',
  },
  button: {
    width: 300,
  },
});
