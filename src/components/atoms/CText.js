import React, {Component} from 'react';
import {Text, StyleSheet, View} from 'react-native';

export default class CText extends Component {
  render() {
    const {style} = this.props;
    return (
      <View>
        <Text {...this.props} style={{...styles.text, ...this.props.style}}>
          {this.props.children}
        </Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  text: {
    fontSize: 15,
    color:'#4f4f4f'
  },
});
