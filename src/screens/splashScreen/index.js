import React, { Component } from 'react';
import { Text, StyleSheet, View, Image } from 'react-native';
import auth from '@react-native-firebase/auth';
import Upvector from '../../../src/assets/Vector7.svg';
import Upvector10 from '../../../src/assets/Vector8.svg';
import Upvector11 from '../../../src/assets/test-00-01.svg';
export default class SplashScreen extends Component {
  componentDidMount() {
    if (auth().currentUser !== null) {
      console.log('User is logged in');
      console.log(auth().currentUser.email);
      setTimeout(() => {
        this.props.navigation.replace('TabNav');
      }, 4000);
    } else {
      setTimeout(() => {
        console.log('not logged in');
        this.props.navigation.replace('OnboardScreen');
      }, 4000);
    }
  }
  render() {
    return (
      <View style={{ flex: 1, backgroundColor: 'white' }}>
        <View style={{ flex: 1, justifyContent: 'center', alignContent: 'center', height: 200, width: 600 }} >
          <Upvector />
        </View>


        <View style={{ flex: 1, backgroundColor: 'white', justifyContent: 'center' }}>
          <Upvector11 style={{ width: 150, height: 150, alignSelf: 'center', justifyContent: 'center' }} />
          <View>
            <Text style={styles.logo} >Temu Barang</Text>
          </View>

        </View>
        <View style={{ flex: 1, backgroundColor: 'white' }}>
          <View style={{ justifyContent: 'center', flex: 1, marginLeft: 0, left: 0 }}>
            <Upvector10 />
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  test: {
    width: 200,
    height: 150,
    resizeMode: 'stretch',
  },
  textInput: {
    width: 100,
    height: 150,
    resizeMode: 'stretch',
  },
  logo: {
    fontFamily: 'Pacifico-Regular',
    color: '#04977D',
    fontSize: 30,
    alignSelf: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    fontWeight: 'bold'
  },
  logo1: {
    fontFamily: 'Pacifico-Regular',
    color: 'brown',
    fontSize: 30,
    alignSelf: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    fontWeight: 'bold'
  },
});
