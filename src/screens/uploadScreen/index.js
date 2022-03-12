import {
  ScrollView,
  TouchableOpacity,
  Text,
  StyleSheet,
  View,
  SafeAreaView,
  TextInput,
  Pressable,
  Image,
  PermissionsAndroid,
} from 'react-native';
import React, {Component} from 'react';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import firestore from '@react-native-firebase/firestore';
import AntDesign from 'react-native-vector-icons/AntDesign';
import CTextInput from '../../components/atoms/CTextInput';
import CText from '../../components/atoms/CText';
import {Picker} from '@react-native-picker/picker';
import CButton from '../../components/atoms/CButton';
export default class Index extends Component {
  constructor() {
    super();
    this.state = {imageCamera: null, dataFire: [], selectedChoice:[]};
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
        let cup = user.map(x => {
          return x.posts;
        });
        this.setState({dataFire: cup.flat()});
      });
  };

  componentDidMount() {}
  render() {
    const {imageCamera, dataFire, selectedChoice} = this.state;
    console.log(dataFire);
    return (
      <SafeAreaView style={{flex: 1}}>
        <ScrollView>
          {/* <Pressable onPress={this._requestCameraPermission} style={styles.tombol}>
          <Text>opencamera</Text>
        </Pressable> */}
          <View>
            <View style={{flexDirection:'row'}}>
              <TouchableOpacity onPress={this._requestCameraPermission}>
                <Image
                  source={
                    imageCamera
                      ? imageCamera
                      : require('../../assets/dummy.png')
                  }
                  style={{
                    width: 200,
                    height: 200,
                    borderWidth: 1,
                    borderColor: 'black',
                  }}
                />
              </TouchableOpacity><View style={{justifyContent:'center',alignItems:'center'}}>
              <View style={{borderWidth:1,borderColor:'black'}}>
                <Picker
                mode='dropdown'
                dropdownIconColor={'black'}
                selectedValue={selectedChoice}
                style={{height: 50, width: 200,color:'black'}}
                onValueChange={(itemValue, itemIndex) =>
                  this.setState({selectedChoice: itemValue})
                }>
                <Picker.Item label="Lost Item" value="lost" />
                <Picker.Item label="Found Item" value="found" />
              </Picker>
                  </View></View>
            </View>
            <View style={styles.bodyContent}>
              <CText style={styles.textcolor}>Nama Barang</CText>
              <View style={styles.profInput}>
                <TextInput
                  placeholder="Name"
                  style={{width: '80%', color: 'dimgrey', paddingLeft: 10}}
                />
                <AntDesign color={'black'} name="edit" size={24} />
              </View>
              <CText style={styles.textcolor}>Kategori Barang</CText>
              <View style={styles.profInput}>
                <TextInput
                  placeholder="Email"
                  style={{width: '80%', color: 'dimgrey', paddingLeft: 10}}
                />
                <AntDesign color={'black'} name="edit" size={24} />
              </View>
              <CText style={styles.textcolor}>
                Lokasi hilang atau ditemukan
              </CText>
              <View style={styles.profInput}>
                <TextInput
                  placeholder="Phone Number"
                  style={{width: '80%', color: 'dimgrey', paddingLeft: 10}}
                />
                <AntDesign color={'black'} name="edit" size={24} />
              </View>
            </View>
            <View style={{justifyContent:'center',alignItems:'center'}}><CButton title="post" /></View>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  profInput: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    borderBottomWidth: 1,
  },
  tombol: {
    padding: 10,
    margin: 10,
    backgroundColor: 'red',
  },
  textcolor: {color: 'black'},
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
