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
} from 'react-native';
import CText from '../../components/atoms/CText';
import AntDesign from 'react-native-vector-icons/AntDesign';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import Delete from 'react-native-vector-icons/Feather';
import storage from '@react-native-firebase/storage';
import {launchImageLibrary} from 'react-native-image-picker';

export default class Profile extends Component {
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
    };
  }
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
    if (path) {
      console.log(path);
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
        await auth().currentUser.updateProfile(update);
      } catch (err) {
        console.log(err);
      }
    } else {
      try {
        const update = {
          displayName: !displayName
            ? auth().currentUser.displayName
            : displayName,
        };
        await auth().currentUser.updateProfile(update);
      } catch (err) {
        console.log(err);
      }
    }
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
    this.mounted = true;
    this.mounted == true &&
      (await firestore()
        .collection('Lost')
        .doc(auth().currentUser.uid)
        .onSnapshot(x => {
          if (x != null) {
            let cup = x.data().posts;
            if (cup) {
              let sorted = cup.flat();
              this.mounted == true &&
                this.setState({dataLost: sorted, refreshing: !refreshing});
            }
          }
        }));
    this.mounted == true &&
      (await firestore()
        .collection('Found')
        .doc(auth().currentUser.uid)
        .onSnapshot(x => {
          if (x != null) {
            let cup = x.data().posts;
            if (cup) {
              let sorted = cup.flat();
              this.mounted == true &&
                this.setState({dataFound: sorted, refreshing: !refreshing});
            }
          }
        }));
  }
  _deletePost = x => {
    const {dataLost, dataFound, refreshing} = this.state;
    const commentexists = firestore()
      .collection('Comments')
      .doc(x.uid + x.postID);
    x.kategoripos == 'Found'
      ? firestore()
          .collection(x.kategoripos)
          .doc(x.uid)
          .update({
            posts: dataFound.filter(post => post.postID != x.postID),
          })
          .then(commentexists && commentexists.delete())
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
          )
          .then(x.photoURL && storage().refFromURL(x.photoURL).delete())
          .catch(function (error) {
            console.error('Error removing document: ', error);
          });
  };
  render() {
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
    } = this.state;
    let dataHistory = [...dataLost, ...dataFound].sort(
      (a, b) => b.time - a.time,
    );

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
                      uri: `${auth().currentUser.photoURL}`,
                    }
                  : imageGallery
                  ? imageGallery
                  : require('../../assets/dummy.png')
              }
            />
          </TouchableOpacity>
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
          {this.mounted == true && dataHistory ? (
            <View>
              <View>
                <Text style={{color: 'grey', marginLeft: 25}}>Your Posts</Text>
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
                          style={{marginLeft: 10}}
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
                              width: 200,
                              height: 200,
                              borderRadius: 25,
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
