import {
  ScrollView,
  TouchableOpacity,
  Text,
  StyleSheet,
  Modal,
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
import Close from 'react-native-vector-icons/AntDesign';
export default class Index extends Component {
  constructor() {
    super();
    this.state = {
      dataFire: [],
      imageCamera: null,
      selectedChoice: '',
      namabarang: '',
      photoURL: '',
      kategori: '',
      lokasi: '',
      uid: '',
      path: '',
      hadiah: '',
      key: '',
      modalVisible: false,
    };
  }
  _requestCameraPermission = async (x) => {
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
        x=='c'?this._openCamera():this._openGallery()
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
;
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
  _openGallery = async () => {
    const options = {
      mediaType: 'photo',
      quality: 1,
    };

    await launchImageLibrary(options, async res => {
      if (res.didCancel) {
        console.log('user cancel');
      } else if (res.errorCode) {
        console.log(res.errorMessage);
      } else {
        let data = res.assets;

        this.setState({imageGallery: data, path: data[0].uri});
      }
    });
  };
 
  _postwoimg = async () => {
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

    try {
      selectedChoice == 'Found'
        ? await firestore()
            .collection(this.state.selectedChoice)
            .doc(auth().currentUser.uid)
            .set(
              {
                posts: firestore.FieldValue.arrayUnion({
                  displayName: auth().currentUser.displayName,
                  ppURL: auth().currentUser.photoURL,
                  postID: new Date().valueOf(),
                  kategoripos: selectedChoice,
                  namabarang: namabarang,
                  photoURL: null,
                  kategori: kategori,
                  lokasi: lokasi,
                  time: new Date(),
                  uid: auth().currentUser.uid,
                  keyunik: key,
                }),
              },
              {merge: true},
            )
            .then(this._emptyFrom())
        : await firestore()
            .collection(this.state.selectedChoice)
            .doc(auth().currentUser.uid)
            .set(
              {
                posts: firestore.FieldValue.arrayUnion({
                  displayName: auth().currentUser.displayName,
                  ppURL: auth().currentUser.photoURL,
                  postID: new Date().valueOf(),
                  kategoripos: selectedChoice,
                  namabarang: namabarang,
                  photoURL: null,
                  kategori: kategori,
                  lokasi: lokasi,
                  time: new Date(),
                  hadiah: hadiah,
                  uid: auth().currentUser.uid,
                  keyunik: key,
                }),
              },
              {merge: true},
            )
            .then(this._emptyFrom());
    } finally {
      alert('post berhasil dikirim');
    }
  };
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
    const photoID = namabarang + new Date().valueOf();
    const reference = storage().ref(
      `posts/${auth().currentUser.uid}/${photoID}`,
    );
    const pathToFile = path;
    await reference.putFile(pathToFile);
    const url = await storage()
      .ref(`posts/${auth().currentUser.uid}/${photoID}`)
      .getDownloadURL();

    try {
      selectedChoice == 'Found'
        ? await firestore()
            .collection(this.state.selectedChoice)
            .doc(auth().currentUser.uid)
            .set(
              {
                posts: firestore.FieldValue.arrayUnion({
                  displayName: auth().currentUser.displayName,
                  ppURL: auth().currentUser.photoURL,
                  postID: new Date().valueOf(),
                  kategoripos: selectedChoice,
                  namabarang: namabarang,
                  photoURL: url,
                  kategori: kategori,
                  lokasi: lokasi,
                  time: new Date(),
                  uid: auth().currentUser.uid,
                  keyunik: key,
                }),
              },
              {merge: true},
            )
            .then(this._emptyFrom())
        : await firestore()
            .collection(this.state.selectedChoice)
            .doc(auth().currentUser.uid)
            .set(
              {
                posts: firestore.FieldValue.arrayUnion({
                  displayName: auth().currentUser.displayName,
                  ppURL: auth().currentUser.photoURL,
                  postID: new Date().valueOf(),
                  kategoripos: selectedChoice,
                  namabarang: namabarang,
                  photoURL: url,
                  kategori: kategori,
                  lokasi: lokasi,
                  time: new Date(),
                  hadiah: hadiah,
                  uid: auth().currentUser.uid,
                  keyunik: key,
                }),
              },
              {merge: true},
            )
            .then(this._emptyFrom());
    } finally {
      alert('post berhasil dikirim');
    }
  };
  _setModalVisible = visible => {
    this.setState({modalVisible: visible});
  };
  _emptyFrom = () => {
    this.setState({
      imageCamera: null,
      selectedChoice: '',
      namabarang: '',
      photoURL: '',
      kategori: '',
      lokasi: '',
      uid: '',
      path: '',
      hadiah: '',
      key: '',
    });
  };
  componentDidMount() {}
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
      path,
      modalVisible,
    } = this.state;
    console.log(selectedChoice);
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
              <TouchableOpacity
                onPress={() => {
                  // this._requestCameraPermission();
                  this._setModalVisible(true);
                }}>
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
                  !selectedChoice || !namabarang
                    ? alert('pilih kategori post dan isi nama barang')
                    : path
                    ? this._postimg()
                    : this._postwoimg();
                }}
              />
            </View>
          </View>
        </ScrollView>
        <Modal
          style={{}}
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            this._setModalVisible(!modalVisible);
          }}>
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <View
              style={{
                justifyContent: 'space-around',
                borderColor: 'black',
                borderWidth: 1,
                borderRadius: 25,
                height: 100,
                width: '70%',
                backgroundColor: 'white',
              }}>
              <View style={{alignItems: 'center'}}>
                <Text style={{color: 'black'}}>Ambil Foto</Text>
              </View>

              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-evenly',
                }}>
                <TouchableOpacity onPress={()=>this._requestCameraPermission("c")}>
                  <Text style={{color: 'black'}}>Camera</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={()=>this._requestCameraPermission("g")}>
                  <Text style={{color: 'black'}}>Galeri</Text>
                </TouchableOpacity>
              </View>
              <TouchableOpacity
                style={{position: 'absolute', top: 10, right: 10}}>
                <View>
                  <Close
                    name="closecircleo"
                    color={'black'}
                    size={25}
                    onPress={() => {
                      this._setModalVisible(!modalVisible);
                    }}
                  />
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
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
