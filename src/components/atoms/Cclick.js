import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';


const Cclick = ({
  text,
  onPress,
  padding,
  backgroundColor,
  color,
  fontSize,
  marginBottom,
  width,
  fontFamily,
  isLoading,
}) => {
  return (
    <TouchableOpacity
      style={styles.container(padding, backgroundColor, marginBottom, width)}
      onPress={onPress}>
      {isLoading ? (
        <ActivityIndicator size="large" color="#00ff00" />
      ) : (
        <Text style={styles.text(color, fontSize, fontFamily)}>{text}</Text>
      )}
    </TouchableOpacity>
  );
};

export default Cclick;

const styles = StyleSheet.create({
  container: (padding, backgroundColor, marginBottom, width, bottom) => ({
    paddingVertical: padding ? padding : 10,
    backgroundColor: backgroundColor ? backgroundColor : colors.primary,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: marginBottom,
    width: width,
  }),
  text: (color, fontSize, fontFamily) => ({
    fontSize: fontSize ? fontSize : 15,
    fontFamily: fontFamily ? fontFamily : fonts.primary.semiBold,
    color: color ? color : colors.white,
  }),
});
