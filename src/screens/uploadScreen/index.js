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
import auth from '@react-native-firebase/auth';
import storage from '@react-native-firebase/storage';
export default class Index extends Component {
  constructor() {
    super();
    this.state = {
      imageCamera: null,
      dataFire: [],
      selectedChoice: '',
      namabarang: '',
      photoURL: '',
      kategori: '',
      lokasi: '',
      comment: [],
      uid: '',
      path: '',
      hadiah: '',
      key: '',
    };
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

        this.setState({imageCamera: data, path: data[0].uri});
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
  // _getFire = async () => {
  //   await firestore()
  //     .collection('Users')
  //     .onSnapshot(x => {
  //       let user = x.docs.map(y => {
  //         return y.data();
  //       });
  //       let cup = user.map(x => {
  //         return x.posts;
  //       });
  //       this.setState({dataFire: cup.flat()});
  //     });
  // };
  _postwoimg=async()=>{
    const {
      selectedChoice,
      namabarang,
      photoURL,
      kategori,
      lokasi,
      comment,
      uid,
      path,
      hadiah,
      key,
    } = this.state;
    
    {
      selectedChoice == 'Found'
        ? await firestore()
            .collection(this.state.selectedChoice)
            .doc(auth().currentUser.uid)
            .set(
              {
                posts: firestore.FieldValue.arrayUnion({
                  kategoripos:selectedChoice,
                  namabarang: namabarang,
                  photoURL: null,
                  kategori: kategori,
                  lokasi: lokasi,
                  time: new Date(),
                  uid: uid,
                  keyunik: key,
                }),
              },
              {merge: true},
            )
        : await firestore()
            .collection(this.state.selectedChoice)
            .doc(auth().currentUser.uid)
            .set(
              {
                posts: firestore.FieldValue.arrayUnion({
                  kategoripos:selectedChoice,
                  namabarang: namabarang,
                  photoURL: null,
                  kategori: kategori,
                  lokasi: lokasi,
                  time: new Date(),
                  hadiah: hadiah,
                  uid: uid,
                  keyunik: key,
                }),
              },
              {merge: true},
            );
    }}
  _postimg = async () => {
    const {
      selectedChoice,
      namabarang,
      photoURL,
      kategori,
      lokasi,
      comment,
      uid,
      path,
      hadiah,
      key,
    } = this.state;
    const reference = storage().ref(
      auth().currentUser.uid + this.state.namabarang,
    );
    const pathToFile = path;
    await reference.putFile(pathToFile);
    const url = await storage()
      .ref(auth().currentUser.uid + this.state.namabarang)
      .getDownloadURL();

    {
      selectedChoice == 'Found'
        ? await firestore()
            .collection(this.state.selectedChoice)
            .doc(auth().currentUser.uid)
            .set(
              {
                posts: firestore.FieldValue.arrayUnion({
                  kategoripos:selectedChoice,
                  namabarang: namabarang,
                  photoURL: url,
                  kategori: kategori,
                  lokasi: lokasi,
                  time: new Date(),
                  uid: uid,
                  keyunik: key,
                }),
              },
              {merge: true},
            )
        : await firestore()
            .collection(this.state.selectedChoice)
            .doc(auth().currentUser.uid)
            .set(
              {
                posts: firestore.FieldValue.arrayUnion({
                  kategoripos:selectedChoice,
                  namabarang: namabarang,
                  photoURL: url,
                  kategori: kategori,
                  lokasi: lokasi,
                  time: new Date(),
                  hadiah: hadiah,
                  uid: uid,
                  keyunik: key,
                }),
              },
              {merge: true},
            );
    }
  };

  componentDidMount() {
    this.setState({uid: auth().currentUser.uid});
  }
  render() {
    const {
      imageCamera,
      dataFire,
      selectedChoice,
      namabarang,
      photoURL,
      kategori,
      lokasi,
      hadiah,
      key,
      path
    } = this.state;

    return (
      <SafeAreaView
        style={
          !selectedChoice
            ? {flex: 1, backgroundColor: 'silver'}
            : selectedChoice == 'Found'
            ? {flex: 1, backgroundColor: 'green'}
            : {flex: 1, backgroundColor: 'chocolate'}
        }>
        <ScrollView>
          {/* <Pressable onPress={this._requestCameraPermission} style={styles.tombol}>
          <Text>opencamera</Text>
        </Pressable> */}
          <View
            style={{
              padding: 5,
              margin: 15,
              borderWidth: 1,
              borderColor: 'black',
              borderRadius: 25,
              backgroundColor: 'white',
            }}>
            <View style={{flexDirection: 'row'}}>
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
                    borderRadius: 25,
                  }}
                />
              </TouchableOpacity>
              <View style={{justifyContent: 'center', alignItems: 'center'}}>
                <CText style={styles.textcolor}>kategori post</CText>
                <View
                  style={{
                    borderWidth: 1,
                    borderColor: 'black',
                    borderRadius: 10,
                  }}>
                  <Picker
                    mode="dropdown"
                    dropdownIconColor={'black'}
                    selectedValue={selectedChoice}
                    style={{height: 50, width: 170, color: 'black'}}
                    onValueChange={(itemValue, itemIndex) =>
                      this.setState({selectedChoice: itemValue})
                    }>
                    <Picker.Item label="..." value={null} />
                    <Picker.Item label="Lost Item" value="Lost" />
                    <Picker.Item label="Found Item" value="Found" />
                  </Picker>
                </View>
              </View>
            </View>
            {!selectedChoice ? (
              <View></View>
            ) : (
              <View style={styles.bodyContent}>
                <CText style={styles.textcolor}>Nama Barang</CText>
                <View style={styles.profInput}>
                  <TextInput
                    placeholderTextColor={'dimgrey'}
                    placeholder="nama barang"
                    style={{width: '80%', color: 'dimgrey', paddingLeft: 10}}
                    value={namabarang}
                    onChangeText={value => this.setState({namabarang: value})}
                  />
                  <AntDesign color={'black'} name="edit" size={24} />
                </View>
                <CText style={styles.textcolor}>Kategori Barang</CText>
                <View style={styles.profInput}>
                  <TextInput
                    placeholderTextColor={'dimgrey'}
                    placeholder="kategori barang"
                    style={{width: '80%', color: 'dimgrey', paddingLeft: 10}}
                    value={kategori}
                    onChangeText={value => this.setState({kategori: value})}
                  />
                  <AntDesign color={'black'} name="edit" size={24} />
                </View>
                <CText style={styles.textcolor}>
                  {selectedChoice == 'Found'
                    ? 'Lokasi ditemukan'
                    : 'Lokasi Hilang'}
                </CText>
                <View style={styles.profInput}>
                  <TextInput
                    placeholderTextColor={'dimgrey'}
                    placeholder="lokasi"
                    style={{width: '80%', color: 'dimgrey', paddingLeft: 10}}
                    value={lokasi}
                    onChangeText={value => this.setState({lokasi: value})}
                  />
                  <AntDesign color={'black'} name="edit" size={24} />
                </View>
                <CText style={styles.textcolor}>Kunci Pembeda</CText>
                <View style={styles.profInput}>
                  <TextInput
                    placeholderTextColor={'dimgrey'}
                    placeholder="ciri"
                    style={{width: '80%', color: 'dimgrey', paddingLeft: 10}}
                    value={key}
                    onChangeText={value => this.setState({key: value})}
                  />
                  <AntDesign color={'black'} name="edit" size={24} />
                </View>
                {selectedChoice == 'Lost' ? (
                  <View>
                    <CText style={styles.textcolor}>
                      Hadiah Bagi Yang Menemukan
                    </CText>
                    <View style={styles.profInput}>
                      <TextInput
                        placeholderTextColor={'dimgrey'}
                        placeholder="nilai"
                        style={{
                          width: '80%',
                          color: 'dimgrey',
                          paddingLeft: 10,
                        }}
                        value={hadiah}
                        onChangeText={value => this.setState({hadiah: value})}
                      />
                      <AntDesign color={'black'} name="edit" size={24} />
                    </View>
                  </View>
                ) : (
                  <View></View>
                )}
              </View>
            )}
            <View
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                marginTop: 10,
              }}>
              <CButton
                title="post"
                onPress={() => {
                  !selectedChoice ? alert('pilih kategori post'):path? this._postimg():this._postwoimg() 
                }}
              />
            </View>
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
    borderBottomWidth: 1,
  },
  tombol: {
    padding: 10,
    margin: 10,
    backgroundColor: 'red',
  },
  text: {color: 'black', marginTop: 10},
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
