import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import CText from '../../components/atoms/CText';
import AntDesign from 'react-native-vector-icons/AntDesign';
import auth from '@react-native-firebase/auth';

export default class Profile extends Component {
  constructor() {
    super();
    this.state = {
      edit: false,
      editing: false,
      imageCamera: null,
      displayName: '',
      photoURL: '',
      phoneNumber: '',
    };
  }
  _saveprofile = async () => {
    const {edit, editing, imageCamera, displayName, phoneNumber, photoURL} =
      this.state;
    const update = {
      displayName: !displayName ?auth().currentUser.displayName  : displayName,
      photoURL: photoURL!=null ? photoURL : auth().currentUser.photoURL,
      };
    await auth().currentUser.updateProfile(update);
    };
  _requestCameraPermission = async () => {
    try {
      const granted =
        (await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA,
        )) &&
        (await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        ));
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('You can use the camera');
        this._openCamera();
      } else {
        console.log('Camera permission denied');
      }
    } catch (err) {
      console.warn(err);
    }
  };

  _openCamera = async () => {
    const options = {
      mediaType: 'photo',
      quality: 1,
      cameraType: 'back',
      saveToPhotos: true,
    };

    await launchCamera(options, async res => {
      if (res.didCancel) {
        console.log('user cancel');
      } else if (res.errorCode) {
        console.log(res.errorMessage);
      } else {
        let data = res.assets;

        this.setState({imageCamera: data});
      }
    });
  };
  render() {
    const {edit, editing, imageCamera, displayName, phoneNumber, photoURL} =
      this.state;
      console.log(auth().currentUser)
    return (
      <View style={styles.container}>
        {edit == false ? (
          <TouchableOpacity
            onPress={() => this.setState({edit: !edit, editing: false})}>
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
        ) : (
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <TouchableOpacity
              onPress={() => {
                this._saveprofile(), this.setState({edit: !edit});
              }}>
              <Text
                style={{
                  color: 'white',
                  paddingTop: 20,
                  paddingLeft: 20,
                }}>
                Save
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => this.setState({edit: !edit})}>
              <Text
                style={{
                  color: 'white',
                  paddingTop: 20,
                  paddingRight: 20,
                }}>
                Cancel
              </Text>
            </TouchableOpacity>
          </View>
        )}
        <View style={styles.header}>
          <Image
            style={styles.avatar}
            source={
              edit == false
                ? {
                    uri: `${auth().currentUser.photoURL}`,
                  }
                : require('../../assets/dummy.png')
            }
          />
        </View>
        <View style={styles.body}>
          <View style={styles.bodyContent}>
            <CText style={styles.textcolor}>Name</CText>
            <View
              style={{
                justifyContent: 'space-between',
                alignItems: 'center',
                flexDirection: 'row',
                marginBottom: 10,
                borderBottomWidth: 1,
              }}>
              {editing == true && edit == true ? (
                <TextInput
                  placeholderTextColor={'dimgrey'}
                  placeholder={auth().currentUser.displayName}
                  style={{color: 'dimgrey', width: '80%'}}
                  value={displayName}
                  onChangeText={value => this.setState({displayName: value})}
                />
              ) : (
                <Text style={{color: 'dimgrey'}}>
                  {auth().currentUser.displayName}
                </Text>
              )}
              {edit == true ? (
                <TouchableOpacity
                  onPress={() => this.setState({editing: !editing})}>
                  <AntDesign color={'black'} name="edit" size={24} />
                </TouchableOpacity>
              ) : (
                <View></View>
              )}
            </View>
            <CText style={styles.textcolor}>Email</CText>
            <View
              style={{
                marginBottom: 10,
                borderBottomWidth: 1,
              }}>
              <Text style={{color: 'dimgrey'}}>{auth().currentUser.email}</Text>
            </View>
            <CText style={styles.textcolor}>Phone Number</CText>
            <View
              style={{
                justifyContent: 'space-between',
                alignItems: 'center',
                flexDirection: 'row',
                marginBottom: 10,
                borderBottomWidth: 1,
              }}>
              
                <Text style={{color: 'dimgrey'}}>
                  {auth().currentUser.phoneNumber}
                </Text>
            
            </View>
            <TouchableOpacity>
              <Text
                onPress={() => {
                  this.props.navigation.navigate('ForgotScreen', {
                    passEmail: auth().currentUser.email,
                  });
                }}
                style={{color: 'green'}}>
                Change Password
              </Text>
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
    color: 'dimgrey',
  },
  profInput: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    marginBottom: 10,
    borderBottomWidth: 1,
  },
  textcolor: {color: 'black'},
});
