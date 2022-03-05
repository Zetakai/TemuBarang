import React, { Component } from 'react'
import { Text, StyleSheet, View, Image } from 'react-native'
import {Logo} from "../../assets/media"


export default class Index extends Component {
  componentDidMount() {
    setTimeout(() => { this.props.navigation.replace('OnboardScreen') }, 4000)
  }
  render() {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', flexDirection: 'row' }}>
        <View>

          <View>
            <View style={{ alignItems: 'center' }}>
              <Image style={styles.test} source={require('../../assets/media/test-00-01.png')} />
            </View>
          </View>
        </View>
      </View>


    )
  }
}

const styles = StyleSheet.create({


  test: {
    width: 300,
    height: 300,
    resizeMode: 'stretch',


  },
  textInput: {
    width: 100,
    height: 150,
    resizeMode: 'stretch',

  },
})
