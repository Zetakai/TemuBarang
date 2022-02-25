import React, {Component} from 'react';
import {Text, StyleSheet, View, TouchableOpacity} from 'react-native';

export default class CButton extends Component {
  render() {
    const {style, title} = this.props;
    return (
      <View>
        <TouchableOpacity {...this.props} style={{...styles.button, ...style}}>
          <Text>
            {title}
          </Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 25,
    borderColor: 'blue',
    borderWidth: 2,
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5
  },
});
