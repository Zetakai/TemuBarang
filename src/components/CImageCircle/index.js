import React from 'react';
import {Image, StyleSheet, Text, View} from 'react-native';
import {responsiveWidth} from '../utils/Utility';

const CImageCircle = ({image, height, width, backgroundColor}) => {
  return (
    <View style={styles.container(height, width, backgroundColor)}>
      <Image source={image} style={styles.image(height, width)} />
    </View>
  );
};

export default CImageCircle;

const styles = StyleSheet.create({
  container: (height, width, backgroundColor) => ({
    width: width ? width : responsiveWidth(60),
    height: height ? height : responsiveWidth(60),
    borderRadius: 90,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: backgroundColor,
  }),
  image: (height, width) => ({
    width: width ? width : responsiveWidth(60),
    height: height ? height : responsiveWidth(60),
  }),
});
