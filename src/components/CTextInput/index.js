import {Text, StyleSheet, View, TextInput} from 'react-native';
import React, {Component} from 'react';

export default class index extends Component {
  render() {
    return (
      <View style={{...styles.inputbox, ...this.props.style}}>
        <TextInput {...this.props} placeholderTextColor={'black'} />
        {this.props.children}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  inputbox: {
    borderWidth: 1,
    borderColor: 'black',
    width: 300,
    height: 60,
  },
});
