import React, {Component} from 'react';
import {Text, StyleSheet, View, Image} from 'react-native';
import auth from '@react-native-firebase/auth';
import Upvector from '../../../src/assets/Vector7.svg';
import Upvector10 from '../../../src/assets/Vector8.svg';
import Upvector11 from '../../../src/assets/test-01.svg';
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
      <View style={{flex: 1, backgroundColor: 'white'}}>
        <View style={{flex: 1, top: -50}}>
          <Upvector color={'green'} />
        </View>
        <View style={{flex: 1, backgroundColor: 'white'}}>
          <View>
            <Upvector11 />
          </View>
        </View>
        <View style={{flex: 1, justifyContent: 'center'}}>
          <Upvector10 color={'green'} />
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
});
