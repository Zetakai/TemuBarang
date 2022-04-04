import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  TextInput,
  ScrollView,
  PermissionsAndroid,
  Modal,
} from 'react-native';
import CText from '../../components/atoms/CText';
import Edit from 'react-native-vector-icons/Feather';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import Delete from 'react-native-vector-icons/Feather';
import storage from '@react-native-firebase/storage';
import {launchImageLibrary} from 'react-native-image-picker';
import {connect} from 'react-redux';
import Back from 'react-native-vector-icons/FontAwesome5';
import Menu from 'react-native-vector-icons/Ionicons';
import Logout from 'react-native-vector-icons/MaterialCommunityIcons';

export class Profile extends Component {
  constructor() {
    super();
    this.state = {
      edit: false,
      editing: false,
      imageGallery: null,
      displayName: '',
      photoURL: '',
      phoneNumber: '',
      dataLost: [],
      dataFound: [],
      refreshing: false,
      path: '',
      confirm: null,
      code: '',
      settingAcc: false,
      modalVisible: false,
    };
  }

  _setModalVisible = visible => {
    this.setState({modalVisible: visible});
  };

  _verifyPhoneNumber = async () => {
    const confirmation = await auth().verifyPhoneNumber(phoneNumber);
    this.setState({confirm: confirmation});
  };
  _confirmCode = async () => {
    try {
      const credential = auth.PhoneAuthProvider.credential(
        confirm.verificationId,
        code,
      );
      let userData = await auth().currentUser.linkWithCredential(credential);
      setUser(userData.user);
    } catch (error) {
      if (error.code == 'auth/invalid-verification-code') {
        console.log('Invalid code.');
      } else {
        console.log('Account linking error');
      }
    }
  };
  _saveprofile = async () => {
    const {
      edit,
      editing,
      imageGallery,
      displayName,
      phoneNumber,
      photoURL,
      path,
    } = this.state;
    const {user} = this.props;
    if (path) {
      const photoID = new Date().valueOf();
      const reference = storage().ref(
        `profile-photos/${auth().currentUser.uid}/${photoID}`,
      );
      const pathToFile = path;
      await reference.putFile(pathToFile);
      const url = await storage()
        .ref(`profile-photos/${auth().currentUser.uid}/${photoID}`)
        .getDownloadURL();

      try {
        const update = {
          displayName: !displayName
            ? auth().currentUser.displayName
            : displayName,
          photoURL: url != null ? url : auth().currentUser.photoURL,
        };
        await auth()
          .currentUser.updateProfile(update)
          .then(
            () => user.photoURL && storage().refFromURL(user.photoURL).delete(),
          )
          .then(() => this.props.update());
        // .then(() => this._updatePostProfile());
      } catch (err) {
        console.log(err);
        this.props.update();
      }
    } else {
      try {
        const update = {
          displayName: !displayName
            ? auth().currentUser.displayName
            : displayName,
        };
        await auth()
          .currentUser.updateProfile(update)
          .then(
            () => user.photoURL && storage().refFromURL(user.photoURL).delete(),
          )
          .then(() => this.props.update());
        // .then(() => this._updatePostProfile());
      } catch (err) {
        console.log(err);
        this.props.update();
      }
    }
  };
  // _updatePostProfile = async () => {
  //   const {user} = this.props;
  //   let Found = await firestore().collection('Found').doc(user.uid).get();
  //   let Lost = await firestore().collection('Lost').doc(user.uid).get();
  //   Found.posts &&
  //     (await firestore()
  //       .collection(`Found`)
  //       .doc(user.uid)
  //       .update({
  //         posts: Found.map(x => {
  //           return {
  //             ...x,
  //             ppURL: null,
  //             displayName: user.displayName,
  //           };
  //         }),
  //       }));
  //   Lost.posts &&
  //     (await firestore()
  //       .collection(`Lost`)
  //       .doc(user.uid)
  //       .update({
  //         posts: Lost.map(x => {
  //           return {
  //             ...x,
  //             ppURL: null,
  //             displayName: user.displayName,
  //           };
  //         }),
  //       }));
  // };
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
        console.log('You can open image library');
        this._openGallery();
      } else {
        console.log('Image library permission denied');
      }
    } catch (err) {
      console.warn(err);
    }
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
  componentWillUnmount() {
    this.mounted = false;
  }
  async componentDidMount() {
    const {dataLost, dataFound, refreshing} = this.state;
    const {user} = this.props;
    this.mounted = true;
    this.mounted == true &&
      (await firestore()
        .collection('Lost')
        .doc(auth().currentUser.uid)
        .onSnapshot(x => {
          if (x) {
            if (x.data() != null) {
              let cup = x.data().posts;
              if (cup) {
                let sorted = cup.flat();
                this.mounted == true &&
                  this.setState({dataLost: sorted, refreshing: !refreshing});
              }
            }
          }
        }));
    this.mounted == true &&
      (await firestore()
        .collection('Found')
        .doc(auth().currentUser.uid)
        .onSnapshot(x => {
          if (x) {
            if (x.data() != null) {
              let cup = x.data().posts;
              if (cup) {
                let sorted = cup.flat();
                this.mounted == true &&
                  this.setState({dataFound: sorted, refreshing: !refreshing});
              }
            }
          }
        }));
  }
  _deletePost = x => {
    const {dataLost, dataFound, refreshing} = this.state;
    const commentexists = firestore()
      .collection('Comments')
      .doc(x.uid + x.postID);
      const commentchildexists = firestore()
      .collection('CommentsChild')
      .doc(x.uid + x.postID);
    x.kategoripos == 'Found'
      ? firestore()
          .collection(x.kategoripos)
          .doc(x.uid)
          .update({
            posts: dataFound.filter(post => post.postID != x.postID),
          })
          .then(commentexists && commentexists.delete()).then(commentchildexists && commentchildexists.delete())
          .then(x.photoURL && storage().refFromURL(x.photoURL).delete())
          .catch(function (error) {
            console.error('Error removing document: ', error);
          })
      : firestore()
          .collection(x.kategoripos)
          .doc(x.uid)
          .update({
            posts: dataLost.filter(post => post.postID != x.postID),
          })
          .then(
            firestore()
              .collection('Comments')
              .doc(x.uid + x.postID)
              .delete(),
          ).then(commentchildexists && commentchildexists.delete())
          .then(x.photoURL && storage().refFromURL(x.photoURL).delete())
          .catch(function (error) {
            console.error('Error removing document: ', error);
          });
  };

  _userLogout = () => {
    auth()
      .signOut()
      .then(() => {
        console.log('User signed out!');
        this.props.navigation.replace('OnboardScreen');
      })
      .then(this.props.logout());
  };
  _getStats = async () => {
    firestore()
      .collection('Stats')
      .doc(auth().currentUser.uid)
      .get()
      .then(x =>
        alert(`lostpost :${x.data().lostposts}
  foundpost :${x.data().foundposts ? x.data().foundposts : 0}`),
      )
      .catch(e =>
        alert(`lostpost:0
  foundpost:0`),
      );
  };
  render() {
    const {user} = this.props;
    const {
      edit,
      editing,
      imageGallery,
      displayName,
      phoneNumber,
      photoURL,
      refreshing,
      path,
      dataLost,
      dataFound,
      settingAcc,
      modalVisible,
    } = this.state;
    let dataHistory = [...dataLost, ...dataFound].sort(
      (a, b) => b.time - a.time,
    );

    return (
      <View style={styles.container}>
        <View
          style={{
            justifyContent: 'space-between',
            flexDirection: 'row',
            paddingHorizontal: 15,
            backgroundColor: '#00ca74',
            borderBottomLeftRadius: 50,
          }}>
          <View style={{paddingTop: 10, width: '35%'}}>
            <View
              style={{
                borderRadius: 100,
                height: 40,
                width: 40,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              {edit == false && (
                <Back
                  name="arrow-left"
                  color={'white'}
                  size={25}
                  onPress={() => this.props.navigation.goBack()}
                />
              )}
            </View>
          </View>
          <View style={styles.header}>
            <TouchableOpacity
              activeOpacity={edit == false ? 1 : 0}
              style={{justifyContent: 'center'}}
              onPress={() => {
                edit == true && this._requestCameraPermission();
              }}>
              <Image
                style={styles.avatar}
                source={
                  edit == false
                    ? {
                        uri: `${user.photoURL}`,
                      }
                    : imageGallery
                    ? imageGallery
                    : require('../../assets/dummy.png')
                }
              />
            </TouchableOpacity>
          </View>
          <View style={{paddingTop: 10, width: '35%', alignItems: 'flex-end'}}>
            <View
              style={{
                borderRadius: 100,
                height: 40,
                width: 40,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              {edit == false && (
                <Menu
                  name="menu"
                  color={'white'}
                  size={30}
                  onPress={() => this.setState({settingAcc: !settingAcc})}
                />
              )}
            </View>
            {settingAcc == true && (
              <View
                style={{
                  backgroundColor: 'white',
                  borderRadius: 5,
                  paddingHorizontal: 7,
                  top: -10,
                }}>
                <TouchableOpacity
                  style={styles.setting}
                  onPress={() => {
                    this.setState({edit: !edit, settingAcc: !settingAcc});
                  }}>
                  <Text style={styles.textSetting}>Edit Profil</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.setting}
                  onPress={() => {
                    this._getStats();
                  }}>
                  <Text style={styles.textSetting}>Statistik</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.setting}>
                  <Text style={styles.textSetting}>Kontak Kami</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.setting}
                  onPress={() => {
                    this.props.navigation.navigate('VerifyScreen');
                  }}>
                  <Text style={styles.textSetting}>Verifikasi</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.setting}
                  onPress={() => {
                    this.props.navigation.navigate('ForgotScreen', {
                      passEmail: auth().currentUser.email,
                    });
                  }}>
                  <Text style={styles.textSetting}>Reset Password</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.setting}
                  onPress={() => {this._setModalVisible(true), this.setState({settingAcc: !settingAcc})}}>
                  <Text style={styles.textSetting}>Logout</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
        <View style={styles.body}>
          <View style={styles.bodyContent}>
            <Text style={styles.textcolor}>Nama</Text>
            <View
              style={{
                justifyContent: 'space-between',
                alignItems: 'center',
                flexDirection: 'row',
                marginBottom: 10,
                borderBottomWidth: 1,
                paddingVertical: 5,
              }}>
              {edit == true ? (
                <TextInput
                  placeholderTextColor={'dimgrey'}
                  placeholder={auth().currentUser.displayName}
                  style={{
                    color: 'black',
                    width: '80%',
                    height: 30,
                    textAlignVertical: 'bottom',
                    paddingBottom: -20,
                    marginTop: -5,
                    fontSize: 15,
                  }}
                  value={displayName}
                  onChangeText={value => this.setState({displayName: value})}
                />
              ) : (
                <Text style={{color: 'black', fontSize: 15}}>
                  {user.displayName}
                </Text>
              )}
              {edit == true ? (
                <TouchableOpacity
                  onPress={() => this.setState({editing: !editing})}>
                  <Edit color={'black'} name="edit-2" size={24} />
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
                paddingVertical: 5,
              }}>
              <Text style={{color: 'black', fontSize: 15}}>
                {auth().currentUser.email}
              </Text>
            </View>
            <CText style={styles.textcolor}>Nomor Telepon</CText>
            <View
              style={{
                justifyContent: 'space-between',
                alignItems: 'center',
                flexDirection: 'row',
                marginBottom: 10,
                borderBottomWidth: 1,
                paddingVertical: 5,
              }}>
              <Text style={{color: 'black', fontSize: 15}}>
                {auth().currentUser.phoneNumber}
              </Text>
            </View>
            {edit == true && (
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  marginTop: 5,
                }}>
                <TouchableOpacity
                  style={{
                    width: '49%',
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderWidth: 2,
                    borderColor: '#00ca74',
                    borderRadius: 5,
                    height: 40,
                  }}
                  onPress={() => {
                    this.setState({edit: !edit});
                  }}>
                  <Text style={{fontWeight: 'bold', fontSize: 15}}>BATAL</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{
                    width: '49%',
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderWidth: 2,
                    borderColor: '#00ca74',
                    backgroundColor: '#00ca74',
                    borderRadius: 5,
                    height: 40,
                  }}
                  onPress={() => {
                    this._saveprofile(), this.setState({edit: !edit});
                  }}>
                  <Text style={{fontWeight: 'bold', fontSize: 15}}>SIMPAN</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
          {this.mounted == true && dataHistory ? (
            <View style={{marginLeft: 25}}>
              <View>
                <Text style={{color: 'grey', marginBottom: 5}}>Pos Anda</Text>
              </View>
              <ScrollView
                horizontal={true}
                showsHorizontalScrollIndicator={false}>
                {this.mounted == true &&
                  dataHistory.map((x, i) => {
                    return (
                      x && (
                        <TouchableOpacity
                          key={i}
                          style={{marginLeft: 0}}
                          onPress={() =>
                            this.props.navigation.navigate('DetailsScreen', x)
                          }>
                          <Image
                            source={
                              x.photoURL
                                ? {uri: `${x.photoURL}`}
                                : require('../../assets/galeryImages.jpeg')
                            }
                            style={{
                              width: 150,
                              height: 150,
                              borderRadius: 20,
                              borderWidth: 2,
                              borderColor:
                                x.kategoripos == 'Found'
                                  ? 'green'
                                  : 'chocolate',
                            }}
                          />
                          {edit == true && (
                            <TouchableOpacity
                              style={{position: 'absolute', top: 10, right: 10}}
                              onPress={() => {
                                this._deletePost(x);
                              }}>
                              <Delete
                                color={'white'}
                                name="trash-2"
                                size={30}
                              />
                            </TouchableOpacity>
                          )}
                        </TouchableOpacity>
                      )
                    );
                  })}
              </ScrollView>
            </View>
          ) : (
            <View></View>
          )}
        </View>
        <Modal
          animationType="fade"
          transparent
          visible={modalVisible}
          onRequestClose={() => {
            this._setModalVisible(!modalVisible);
          }}>
          <View
            style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <View
              style={{
                width: 300,
                height: 255,
                backgroundColor: '#eeeeee',
                borderRadius: 10,
              }}>
              <View
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  backgroundColor: '#00ca74',
                  height: 40,
                  borderTopLeftRadius: 10,
                  borderTopRightRadius: 10,
                }}>
                <Text
                  style={{fontSize: 17, fontWeight: 'bold', color: 'black'}}>
                  LOGOUT
                </Text>
              </View>
              <View
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  padding: 10,
                }}>
                <Logout name="logout" size={75} color='black' />
              </View>
              <View style={{justifyContent: 'center', alignItems: 'center', paddingHorizontal: 10}}>
                <Text
                  style={{fontSize: 15, color: 'black', textAlign: 'center'}}>
                  Apakah anda yakin ingin logout? Anda dapat login kembali jika
                  ingin menggunakan aplikasi.
                </Text>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  paddingHorizontal: 10,
                  paddingBottom: 15,
                  marginTop: 10
                }}>
                <TouchableOpacity
                  style={{
                    width: '48%',
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderWidth: 2,
                    borderColor: '#00ca74',
                    borderRadius: 5,
                    height: 40,
                  }}
                  onPress={() => {
                    this._setModalVisible(!modalVisible);
                  }}>
                  <Text style={{fontWeight: 'bold', fontSize: 15}}>BATAL</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{
                    width: '48%',
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderWidth: 2,
                    borderColor: '#00ca74',
                    backgroundColor: '#00ca74',
                    borderRadius: 5,
                    height: 40,
                  }}
                  onPress={() => this._userLogout()}>
                  <Text style={{fontWeight: 'bold', fontSize: 15}}>LOGOUT</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    width: '30%',
    height: 220,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 30,
    paddingBottom: 20,
  },
  avatar: {
    width: 130,
    height: 130,
    borderRadius: 63,
    borderWidth: 1,
    borderColor: 'white',
  },
  setting: {
    marginVertical: 4,
    // borderColor: 'grey',
    // borderBottomWidth: 0.5,
    justifyContent: 'center',
  },
  textSetting: {
    color: 'green',
  },
  body: {
    flex: 1,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    backgroundColor: 'white',
  },
  bodyContent: {
    paddingHorizontal: 25,
    paddingTop: 20,
    paddingBottom: 20,
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
  textcolor: {color: 'grey'},
});
const mapStateToProps = state => {
  return {
    user: state.user,
  };
};
const mapDispatchToProps = dispatch => {
  return {
    logout: data => {
      dispatch({
        type: 'LOGOUT-USER',
        payload: data,
      });
    },
    update: data => {
      dispatch({
        type: 'UPDATE-USER',
        payload: data,
      });
    },
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(Profile);
