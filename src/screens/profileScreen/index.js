import React, {Component} from 'react';
import {StyleSheet, Text, View, Image, TouchableOpacity, TextInput} from 'react-native';
import CText from '../../components/atoms/CText';
import AntDesign from 'react-native-vector-icons/AntDesign';
import auth from '@react-native-firebase/auth';

export default class Profile extends Component {
  constructor() {
    super();
    this.state = {
      edit: true,
    };
  }
 
  // const update = {
  //   displayName: 'Obiexakhmad',
  //   photoURL:
  //     'https://www.shareicon.net/data/2016/09/01/822742_user_512x512.png',
  //   };
    
    // await auth().currentUser.updateProfile(update);

  render() {
    const {edit} = this.state;
    return (
      <View style={styles.container}>
        {edit==true ? (
        <TouchableOpacity onPress={() => this.setState({edit: !edit})}>
          <Text
            style={{
              color: 'white',
              alignSelf: 'flex-end',
              paddingTop: 20,
              paddingRight: 20,
            }}>
            Edit Profile
          </Text>
          </TouchableOpacity>
          ):(
          <TouchableOpacity onPress={() => this.setState({edit: !edit})}>
          <Text
            style={{
              color: 'white',
              alignSelf: 'flex-end',
              paddingTop: 20,
              paddingRight: 20,
            }}>
            Save
          </Text>
        </TouchableOpacity>
        )}
        <View style={styles.header}>
          <Image
            style={styles.avatar}
            source={{
              uri: 'https://www.shareicon.net/data/2016/09/01/822742_user_512x512.png',
            }}
          />
        </View>
        <View style={styles.body}>
          {edit == true ? (
            <View style={styles.bodyContent}>
              <CText>Name</CText>
              <Text style={styles.profValue}>{auth().currentUser.displayName}</Text>
              <CText>Email</CText>
              <Text style={styles.profValue}>wajawaja@gmail.com</Text>
              <CText>Phone Number</CText>
              <Text style={styles.profValue}>086232813721</Text>
              <TouchableOpacity>
                <Text style={{color: 'green'}}>Change Password</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.bodyContent}>
              <CText>Name</CText>
              <View style={styles.profInput}>
                <TextInput placeholder="Name" style={{width: '100%'}} />
                <AntDesign name="edit" size={24} />
              </View>
              <CText>Email</CText>
              <View style={styles.profInput}>
                <TextInput placeholder="Email" style={{width: '100%'}} />
                <AntDesign name="edit" size={24} />
              </View>
              <CText>Phone Number</CText>
              <View style={styles.profInput}>
                <TextInput placeholder="Phone Number" style={{width: '100%'}} />
                <AntDesign name="edit" size={22} />
              </View>
            </View>
          )}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'green',
  },
  header: {
    height: 150,
    justifyContent: 'center',
  },
  avatar: {
    width: 130,
    height: 130,
    borderRadius: 63,
    borderWidth: 3,
    borderColor: 'white',
    marginBottom: 10,
    alignSelf: 'center',
    position: 'absolute',
  },
  body: {
    flex: 1,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    backgroundColor: 'white',
    marginTop: 20,
  },
  bodyContent: {
    padding: 30,
  },
  profValue: {
    borderBottomWidth: 1,
    borderBottomColor: 'grey',
    marginBottom: 20,
    marginTop: 5,
  },
  profInput: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 10,
  },
});
