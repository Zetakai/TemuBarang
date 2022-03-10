import React, {Component} from 'react';
import {Text, StyleSheet, View, Image} from 'react-native';
import auth from '@react-native-firebase/auth';
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
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'row',
        }}>
        <View>
          <View>
            <View style={{alignItems: 'center'}}>
              <Image
                style={styles.test}
                source={require('../../../src/assets/test-00-01.png')}
              />
            </View>
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
});
