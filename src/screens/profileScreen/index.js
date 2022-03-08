import React, {Component} from 'react';
import {StyleSheet, Text, View, Image, TouchableOpacity} from 'react-native';
import CButton from '../../components/atoms/CButton';
import CText from '../../components/atoms/CText';

export default class Profile extends Component {
  render() {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
        <TouchableOpacity style={{alignSelf:'flex-end', marginTop: 20, marginRight: 20}}>
              <Text style={{color:'white'}}>Edit Profile</Text>
            </TouchableOpacity>
          </View>
        <Image
          style={styles.avatar}
          source={{
            uri: 'https://www.shareicon.net/data/2016/09/01/822742_user_512x512.png',
          }}
        />
        <View style={styles.body}>
          <View style={styles.bodyContent}>
            <CText>Name</CText>
            <CText>Email</CText>
            <CText>Phone Number</CText>
            <Text>Wut??</Text>
            <CButton title='Edit Profile' />
            <TouchableOpacity>
              <Text style={{color:'green'}}>Change Password</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    backgroundColor: 'green',
    height: 200,
  },
  avatar: {
    width: 130,
    height: 130,
    borderRadius: 63,
    borderWidth: 4,
    borderColor: 'white',
    marginBottom: 10,
    alignSelf: 'center',
    position: 'absolute',
    marginTop: 130,
  },
  body: {
    flex: 1,
    marginTop: 40,
  },
  bodyContent: {
    flex: 1,
    alignItems: 'center',
    padding: 30,
  },
});
