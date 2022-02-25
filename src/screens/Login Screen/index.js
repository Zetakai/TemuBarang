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
import React, { Component } from 'react'

export default class index extends Component {
    constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
     
    };
  }
  render() {
    return (
      <View style={{flex:1}}>
      <Text>allo</Text>
      </View>
    )
  }
}

const styles = StyleSheet.create({})
