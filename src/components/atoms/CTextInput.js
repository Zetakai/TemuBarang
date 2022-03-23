// import {Text, StyleSheet, View, TextInput} from 'react-native';
// import React, {Component} from 'react';

// export default class CTextInput extends Component {
//   render() {
//     return (
//       <View style={{...styles.inputbox, ...this.props.style}}>
//         <TextInput {...this.props} textAlign={'center'} placeholderTextColor={'grey'} color={'black'} />
//         {this.props.children}
//       </View>
//     );
//   }
// }

// const styles = StyleSheet.create({
//   inputbox: {
//     borderWidth: 1,
//     borderRadius: 15,
//     borderColor: 'black',
//     width: 300,
//     height: 60,
//     justifyContent: 'center'
//   },
// });
import React from 'react';
import {StyleSheet, Text, TextInput, View} from 'react-native';
import {colors, fonts} from '../../Utility';

const CTextInput = ({
  textarea,
  width,
  height,
  fontSize,
  placeholder,
  value,
  secureTextEntry,
  keyboardType,
  onChangeText,
  borderWidth,
  type,
}) => {
  if (textarea) {
    return (
      <View>
        <TextInput
          style={styles.inputTextArea(fontSize)}
          multiline={true}
          numberOfLines={3}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          type={type}
        />
      </View>
    );
  }
  return (
    <View>
      <TextInput
        style={styles.input(width, height, fontSize)}
        value={value}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        onChangeText={onChangeText}
        placeholder={placeholder}
        borderWidth={borderWidth}
      />
    </View>
  );
};

export default CTextInput;

const styles = StyleSheet.create({
  input: (width, height, fontSize, borderWidth) => ({
    fontSize: fontSize ? fontSize : 15,
    fontFamily: fonts.primary.regular,
    width: width,
    height: height,
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 17,
    backgroundColor: colors.white,
    borderWidth: borderWidth,
    color: colors.black,
  }),
  inputTextArea: fontSize => ({
    fontSize: fontSize ? fontSize : 18,
    fontFamily: fonts.primary.regular,
    borderWidth: 0.2,
    borderRadius: 5,
    paddingVertical: 5,
    paddingHorizontal: 10,
    textAlignVertical: 'top',
  }),
});
