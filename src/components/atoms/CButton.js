import React, {Component} from 'react';
import {Text, StyleSheet, View, TouchableOpacity} from 'react-native';
import { ActivityIndicator } from 'react-native-paper';

export default class CButton extends Component {
  render() {
    const {style, title} = this.props;
    return (
      <View>
        <TouchableOpacity {...this.props} style={{...styles.button, ...style}}>
        {this.props.children}
          <Text style={styles.text}>
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
    borderColor: 'black',
    borderWidth: 1,
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
    width: 150,
    height: 60,
    flexDirection:'row'
  },
  text:{
    color:'black'
  }
});
