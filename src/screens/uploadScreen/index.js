import { Text, StyleSheet, View, SafeAreaView, Pressable, Alert, Image, PermissionsAndroid } from 'react-native'
import React, { Component } from 'react'
import { launchCamera, launchImageLibrary } from 'react-native-image-picker'
import { Button } from 'react-native-paper'


export default class Index extends Component {
  constructor() {
    super()
    this.state = { imageCamera: null }
  }
  _requestCameraPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA && PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log("You can use the camera");
        this._openCamera()
      } else {
        console.log("Camera permission denied");
      }
    } catch (err) {
      console.warn(err);
    }
  };
  _requestStoragePermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE && PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log("izinkan untuk penyimpanan");
        this._openLibarary()
      } else {

        console.log("izin penyimpanan di tolak");
      }
    } catch (err) {
      console.warn(err);
    }
  };

  _openCamera = () => {


    const options = {
      mediaType: 'photo',
      quality: 1

    }

    launchCamera(options, (res) => {
      if (res.didCancel) {
        console.log('user cancel')
      } else if (res.errorCode) {
        console.log(res.errorMessage)
      } else {
        const data = res.assets

        console.log(data)
      }

    })
  }
  _openLibarary = () => {


    const options = {
      mediaType: 'photo',
      quality: 1

    }

    launchImageLibrary(options, (res) => {
      if (res.didCancel) {
        console.log('user cancel')
      } else if (res.errorCode) {
        console.log(res.errorMessage)
      } else {
        const data = res.assets[0]
        console.log(data)
        this.setState({ imageCamera: data })
      }

    })
  }
  componentDidMount() {
    this._requestCameraPermission();
  }
  render() {
    const { imageCamera } = this.state;
    return (
      <SafeAreaView>


        <Text>camera</Text>
       <View>
       {imageCamera!=null &&
         <Image source={imageCamera} style={{ width: 100, height: 100 }} />
         } 
         
       </View>
       
        <Pressable onPress={this._openCamera} style={styles.tombol}>

          <Text>opencamera</Text>
        </Pressable>
        <Pressable onPress={this._openLibarary} style={styles.tombol}>

          <Text>Foto</Text>
        </Pressable>
      </SafeAreaView>
    )
  }
}

const styles = StyleSheet.create({
  tombol: {
    padding: 10,
    margin: 10,
    backgroundColor: 'red'
  }
})