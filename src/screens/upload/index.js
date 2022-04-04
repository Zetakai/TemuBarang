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
  ToastAndroid,
  Keyboard,
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
export default class UploadScreen extends Component {
  constructor() {
    super();
    this.state = {
      dataFire: [],
      insertedImage: null,
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
      dataLost: [],
      dataFound: [],
      renderData: [],
      renderData2: [],
      showcat: false,
      deskripsi: '',
    };
  }
  _requestCameraPermission = async x => {
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
        x == 'c' ? this._openCamera() : this._openGallery();
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

        this.setState({insertedImage: data, path: data[0].uri});
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

        this.setState({insertedImage: data, path: data[0].uri});
      }
    });
  };
  _onPostStatsLost = async () => {
    // Create a reference to the post
    const postReference = firestore()
      .collection('Stats')
      .doc(`${auth().currentUser.uid}`);

    return firestore()
      .runTransaction(async transaction => {
        // Get post data first
        const postSnapshot = await transaction.get(postReference);
        const check = postSnapshot.data();
        const lost = check && check.lostposts;
        {
          !lost
            ? transaction.update(postReference, {
                lostposts: 1,
              })
            : transaction.update(postReference, {
                lostposts: postSnapshot.data().lostposts + 1,
              });
        }
      })
      .catch(e => {
        console.log('document hasnt been made. making one');
        postReference.set({
          lostposts: 1,
        });
      });
  };
  _onPostStatsFound = async () => {
    // Create a reference to the post
    const postReference = firestore()
      .collection('Stats')
      .doc(`${auth().currentUser.uid}`);

    return firestore()
      .runTransaction(async transaction => {
        // Get post data first
        const postSnapshot = await transaction.get(postReference);
        const check = postSnapshot.data();
        const found = check && check.foundposts;
        {
          !found
            ? transaction.update(postReference, {
                foundposts: 1,
              })
            : transaction.update(postReference, {
                foundposts: postSnapshot.data().foundposts + 1,
              });
        }
      })
      .catch(e => {
        console.log('document hasnt been made. making one');
        postReference.set({
          foundposts: 1,
        });
      });
  };
  _postwoimg = async () => {
    const {
      deskripsi,
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
                  deskripsi: deskripsi,
                }),
              },
              {merge: true},
            )
            .then(this._onPostStatsFound())
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
                  deskripsi: deskripsi,
                }),
              },
              {merge: true},
            )
            .then(this._onPostStatsLost())
            .then(this._emptyFrom());
    } finally {
      ToastAndroid.show('post berhasil dikirim', ToastAndroid.SHORT);
    }
  };
  _postimg = async () => {
    const {
      deskripsi,
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
                  deskripsi: deskripsi,
                }),
              },
              {merge: true},
            )
            .then(this._onPostStatsFound())
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
                  deskripsi: deskripsi,
                }),
              },
              {merge: true},
            )
            .then(this._onPostStatsLost())
            .then(this._emptyFrom());
    } finally {
      ToastAndroid.show('post berhasil dikirim', ToastAndroid.SHORT);
    }
  };
  _setModalVisible = visible => {
    this.setState({modalVisible: visible});
  };
  _emptyFrom = () => {
    this.mounted == true &&
      this.setState({
        insertedImage: null,
        selectedChoice: '',
        namabarang: '',
        photoURL: '',
        kategori: '',
        lokasi: '',
        uid: '',
        path: '',
        hadiah: '',
        key: '',
        deskripsi: '',
      });
  };
  async componentDidMount() {
    const {dataLost, dataFound, dataHistory} = this.state;
    this.mounted = true;
    await firestore()
      .collection('Lost')
      .onSnapshot(x => {
        if (x != null) {
          let user = x.docs.map(y => {
            return y.data();
          });
          let cup = user.map(x => {
            return x.posts;
          });
          let sorted = cup.flat().sort((a, b) => b.time - a.time);
          this.mounted == true && this.setState({dataLost: sorted});
        }
      });
    await firestore()
      .collection('Found')
      .onSnapshot(x => {
        if (x != null) {
          let user = x.docs.map(y => {
            return y.data();
          });
          let cup = user.map(x => {
            return x.posts;
          });
          let sorted = cup.flat().sort((a, b) => b.time - a.time);
          this.mounted == true && this.setState({dataFound: sorted});
        }
      });
  }
  componentWillUnmount() {
    this.mounted = false;
  }
  _barangSearchkategori = text => {
    const {
      renderData,
      renderData2,
      dataHistory,
      kategori,
      dataFound,
      dataLost,
      selectedChoice,
      showcat,
    } = this.state;

    if (selectedChoice == 'Found') {
      if (text) {
        const newData = dataFound.filter(item => {
          const itemData = item.kategori
            ? item.kategori.toUpperCase()
            : ''.toUpperCase();
          const textData = text.toUpperCase();
          return itemData.indexOf(textData) > -1;
        });
        this.setState({renderData2: newData});
        console.log(renderData2);
      } else {
        this.setState({renderData2: []});
      }
    }
    if (selectedChoice == 'Lost') {
      if (text) {
        const newData = dataLost.filter(item => {
          const itemData = item.kategori
            ? item.kategori.toUpperCase()
            : ''.toUpperCase();
          const textData = text.toUpperCase();
          return itemData.indexOf(textData) > -1;
        });
        this.setState({renderData: newData});
      } else {
        this.setState({renderData: []});
      }
    }
  };
  render() {
    const {
      deskripsi,
      insertedImage,
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
      dataLost,
      dataFound,
      renderData,
      renderData2,
      showcat,
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
        <ScrollView
          ref={ref => {
            this.scrollView = ref;
          }}
          onContentSizeChange={() =>
            this.scrollView.scrollTo({y: 200, animated: true})
          }>
          {/* <Pressable onPress={this._requestCameraPermission} style={styles.tombol}>
          <Text>opencamera</Text>
        </Pressable> */}
          <View
            style={{
              padding: 5,
              marginBottom: selectedChoice ? 15 : 0,
              marginTop: selectedChoice ? 15 : 50,
              marginHorizontal: selectedChoice ? 15 : 100,
              borderWidth: 1,
              borderColor: 'black',
              borderRadius: 25,
              backgroundColor: 'white',
            }}>
            <View style={{flexDirection: 'row', justifyContent: 'center'}}>
              {/[o]/.test(selectedChoice) && (
                <TouchableOpacity
                  onPress={() => {
                    // this._requestCameraPermission();
                    this._setModalVisible(true);
                  }}>
                  <Image
                    source={
                      insertedImage
                        ? insertedImage
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
              )}
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
                    onFocus={() => this.setState({showcat: false})}
                  />
                </View>
                <CText style={styles.textcolor}>Kategori Barang</CText>
                <View style={styles.profInput}>
                  <TextInput
                    placeholderTextColor={'dimgrey'}
                    placeholder="kategori barang"
                    style={{width: '80%', color: 'dimgrey', paddingLeft: 10}}
                    value={kategori}
                    onChangeText={value => {
                      this._barangSearchkategori(value);
                      this.setState({kategori: value});
                    }}
                    onFocus={() => this.setState({showcat: true})}
                    
                  />
                </View>
                <View
                  style={{
                    borderColor: 'black',
                    borderWidth: kategori && showcat ? 1 : 0,
                    backgroundColor: 'black',
                    width: '100%',
                  }}>
                  {selectedChoice == 'Lost' && showcat == true
                    ? renderData.map((value, index) => {
                        if (value.kategori) {
                          return (
                            <View key={index}>
                              <Text
                                onPress={() => {
                                  this.setState({
                                    kategori: value.kategori,
                                    renderData: [],
                                    showcat: false,
                                  });
                                }}
                                style={{color: 'white'}}>
                                {value.kategori}
                              </Text>
                            </View>
                          );
                        }
                      })
                    : showcat == true&&renderData2.map((value, index) => {
                        if (value.kategori) {
                          return (
                            <View key={index}>
                              <Text
                                onPress={() => {
                                  this.setState({
                                    kategori: value.kategori,
                                    renderData2: [],
                                    showcat: false,
                                  });
                                }}
                                style={{color: 'white'}}>
                                {value.kategori}
                              </Text>
                            </View>
                          );
                        }
                      })}
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
                    onFocus={() => this.setState({showcat: false})}
                  />
                </View>
                {/* <CText style={styles.textcolor}>Ciri-ciri barang</CText>
                <View style={styles.profInput}>
                  <TextInput
                    placeholderTextColor={'dimgrey'}
                    placeholder="ciri"
                    style={{width: '80%', color: 'dimgrey', paddingLeft: 10}}
                    value={key}
                    onChangeText={value => this.setState({key: value})}
                    onFocus={() => this.setState({showcat: false})}
                  />
                </View> */}
                <CText style={styles.textcolor}>Deskripsi Barang</CText>
                <View style={styles.profInput}>
                  <TextInput
                    placeholderTextColor={'dimgrey'}
                    placeholder="deskripsi"
                    style={{width: '80%', color: 'dimgrey', paddingLeft: 10}}
                    value={deskripsi}
                    onChangeText={value => this.setState({deskripsi: value})}
                    onFocus={() => this.setState({showcat: false})}
                  />
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
                        onFocus={() => this.setState({showcat: false})}
                      />
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
                    ? ToastAndroid.show(
                        'pilih kategori post dan isi nama barang',
                        ToastAndroid.SHORT,
                      )
                    : path
                    ? this._postimg()
                    : this._postwoimg();
                }}
              />
            </View>
          </View>
          {!selectedChoice && (
            <View
              style={{
                padding: 5,
                marginTop: 50,
                borderWidth: 1,
                borderColor: 'black',
                borderRadius: 25,
                backgroundColor: 'white',
                marginHorizontal: 15,
              }}>
              <Text
                style={{
                  color: 'black',
                  alignSelf: 'center',
                  fontWeight: 'bold',
                }}>
                Disclaimer
              </Text>
              <Text style={{color: 'black'}}>
                1. jika barang merupakan dokumen harap perhatikan privasi
                pemilik barang, mohon untuk tidak manampikan/di sensor nomer id,
                Tanggal lahir, contoh: KTP, Ijazah{' '}
              </Text>
              <Text style={{color: 'black'}}>
                2. jika barang merupakan barang berharga di harapkan untuk
                meyerahkan ke pihak terkait: kantor polisi, pos satpam dan
                pelayanan masyarakat terdekat
              </Text>
            </View>
          )}
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
                <TouchableOpacity
                  onPress={() => {
                    this._requestCameraPermission('c');
                    this._setModalVisible(!modalVisible);
                  }}>
                  <Text style={{color: 'black'}}>Camera</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    this._requestCameraPermission('g');
                    this._setModalVisible(!modalVisible);
                  }}>
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
