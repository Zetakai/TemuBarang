import {ScrollView,
  Text,
  StyleSheet,
  View,
  SafeAreaView,
  Pressable,
  Image,
  PermissionsAndroid,
} from 'react-native';
import React, {Component} from 'react';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import firestore from '@react-native-firebase/firestore';

export default class Index extends Component {
  constructor() {
    super();
    this.state = {imageCamera: null, dataFire: []};
  }
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

  _openCamera = () => {
    const options = {
      mediaType: 'photo',
      quality: 1,
      cameraType: 'back',
      saveToPhotos: true,
    };

    launchCamera(options, res => {
      if (res.didCancel) {
        console.log('user cancel');
      } else if (res.errorCode) {
        console.log(res.errorMessage);
      } else {
        let data = res.assets;
        console.log(data);
        this.setState({imageCamera: data});
      }
    });
  };
  // _getFire = async () => {
  //   await firestore()
  //     .collection('Users')
  //     .doc('12345zaki')
  //     .onSnapshot(user => {
  //       this.setState({dataFire: user.data().posts});
  //     });
  // };
  _getFire = async () => {
    await firestore()
      .collection('Users')
      .onSnapshot(x => {
        let user = x.docs.map(y => {
          return y.data();
        });
        let cup=user.map(x=>{return x.posts})
        this.setState({dataFire: cup.flat()})
      });
  };

  componentDidMount() {}
  render() {
    const {imageCamera, dataFire} = this.state;
    console.log(dataFire);
    return (
      <SafeAreaView style={{flex: 1}}>
        <ScrollView>
        <Text>camera</Text>

        <Pressable onPress={this._getFire} style={styles.tombol}>
          <Text>opencamera</Text>
        </Pressable>
        <Image source={imageCamera} style={{width: 100, height: 100}} />
        {dataFire.map((x, i) => {
          return (
            <View>
              <Image
                source={{uri: `${x.photoURL}`}}
                style={{width: 150, height: 150}}
              />
            </View>
          );
        })}
        </ScrollView>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  tombol: {
    padding: 10,
    margin: 10,
    backgroundColor: 'red',
  },
});

// import React, { Fragment, Component } from 'react';
// import {launchCamera,launchImageLibrary} from 'react-native-image-picker';
// import {
//   SafeAreaView,
//   StyleSheet,
//   ScrollView,
//   View,
//   Text,
//   StatusBar,
//   Image,
//   Button,
//   Dimensions,
//   TouchableOpacity
// } from 'react-native';

// import {
//   Header,
//   LearnMoreLinks,
//   Colors,
//   DebugInstructions,
//   ReloadInstructions,
// } from 'react-native/Libraries/NewAppScreen';

// const options = {
//   title: 'Select Avatar',
//   customButtons: [{ name: 'fb', title: 'Choose Photo from Facebook' }],
//   storageOptions: {
//     skipBackup: true,
//     path: 'images',
//   },
// };
// export default class App extends Component {
//   constructor(props) {
//     super(props)
//     this.state = {
//       filepath: {
//         data: '',
//         uri: ''
//       },
//       fileData: '',
//       fileUri: ''
//     }
//   }

//   chooseImage = () => {
//     let options = {
//       title: 'Select Image',
//       customButtons: [
//         { name: 'customOptionKey', title: 'Choose Photo from Custom Option' },
//       ],
//       storageOptions: {
//         skipBackup: true,
//         path: 'images',
//       },
//     };
//     launchImageLibrary(options, (response) => {
//       console.log('Response = ', response);

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