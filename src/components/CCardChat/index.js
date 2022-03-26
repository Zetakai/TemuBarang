import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import CImageCircle from '../CImageCircle';
import {colors, fonts} from '../utils/Utility';

const CCardChat = ({onPress, name, message, image}) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity style={{flexDirection:'row-reverse'}} onPress={onPress}>
        <View style={{width: '20%'}}>
          <CImageCircle
            image={
              image
                ? {uri: image}
                : require('../../assets/userdummy.png')
            }
          />
        </View>
        <View style={styles.desc}>
          <View style={styles.nameDate}>
            <Text style={[styles.name,{color:'black'}]}>{name}</Text>
          </View>
          <Text style={[styles.dateMessage,{color:'black'}]}>{message}</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default CCardChat;

const styles = StyleSheet.create({
  container: {
    paddingVertical: 20,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 0.2,
    borderColor: colors.gray,
  },
  desc: {
    width: '80%',
  },
  nameDate: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  name: {
    fontFamily: fonts.primary.medium,
    fontSize: 15,
  },
});
