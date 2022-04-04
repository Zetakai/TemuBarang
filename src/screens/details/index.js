import {
  TouchableOpacity,
  Text,
  StyleSheet,
  View,
  Image,
  ScrollView,
  TextInput,
  Button,
  Modal,
  Alert,
} from 'react-native';
import React, {Component} from 'react';
import CText from '../../components/atoms/CText';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import Close from 'react-native-vector-icons/AntDesign';
import {NavigationContainer} from '@react-navigation/native';
import CButton from '../../components/atoms/CButton';
import {connect} from 'react-redux';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Back from 'react-native-vector-icons/FontAwesome5';
import Verified from 'react-native-vector-icons/MaterialIcons';
import {timeSince,convertDateOnly,getHour} from '../../components/utils/moment';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import Date from 'react-native-vector-icons/Fontisto';
export class DetailsScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      comment: '',
      dataComments: [],
      modalVisible: false,
      modalVisibleComment: false,
      dataCommentsChild: [],
      commentIDs: [],
      isVerified: false,
    };
    let mounted;
  }
  _setModalVisible = visible => {
    this.setState({modalVisible: visible});
  };
  _setModalVisibleComment = visible => {
    this.setState({modalVisibleComment: visible});
  };
  _isVerified = async () => {
    const {user} = this.props;
    const {params} = this.props.route;
    const verifiedUsers = await firestore()
      .collection('VerifiedAccounts')
      .doc('Official')
      .get();
    const datauid = verifiedUsers.data().Users;

    const newData = datauid.filter(user => {
      const userData = user.uid;
      return userData.indexOf(params.uid) > -1;
    });

    this.setState({isVerified: newData});
  };
  async componentDidMount() {
    const {params} = this.props.route;
    const {data, showModal} = this.state;
    this.setState({data: params});
    this.mounted = true;
    this._isVerified();
    await firestore()
      .collection('Comments')
      .doc(`${params.uid}` + `${params.postID}`)
      .onSnapshot(x => {
        if (x) {
          if (x.data() != null) {
            let cup = x.data().comments;
            if (cup) {
              let sorted = cup.flat().sort((a, b) => a.time - b.time);
              this.mounted == true && this.setState({dataComments: sorted});
            }
          }
        }
      });
    await firestore()
      .collection('CommentsChild')
      .doc(`${params.uid}` + `${params.postID}`)
      .onSnapshot(x => {
        if (x) {
          if (x.data() != null) {
            let cup = x.data().comments;
            if (cup) {
              let sorted = cup.flat().sort((a, b) => a.time - b.time);
              this.mounted == true &&
                this.setState({dataCommentsChild: sorted});
            }
          }
        }
      });
  }
  componentWillUnmount() {
    this.setState({modalVisible: false});
    this.mounted = false;
  }

  _postcomment = async () => {
    const {data, comment} = this.state;
    const {user} = this.props;
    await firestore()
      .collection('Comments')
      .doc(`${data.uid}` + `${data.postID}`)
      .set(
        {
          comments: firestore.FieldValue.arrayUnion({
            postUID: data.uid,
            commentID: data.postID + user.uid + new Date().valueOf(),
            displayName: user.displayName,
            photoURL: user.photoURL,
            comment: comment,
            time: new Date(),
            uid: user.uid,
          }),
        },
        {merge: true},
      )
      .then(this.mounted == true && this.setState({comment: ''}));
  };
  render() {
    const {navigation, user} = this.props;
    const {params} = this.props.route;
    const {
      data,
      comment,
      dataComments,
      dataCommentsChild,
      modalVisible,
      modalVisibleComment,
      commentIDs,
      isVerified,
    } = this.state;
    return (
      <View style={styles.container}>
        <View style={{}}>
          <View style={{backgroundColor: 'white'}}>
            <Modal
              animationType="fade"
              transparent={true}
              visible={modalVisible}
              onRequestClose={() => {
                this._setModalVisible(!modalVisible);
              }}>
              <View
                style={{
                  borderWidth: 1,
                  borderColor: 'black',
                  backgroundColor: 'white',
                }}>
                <View>
                  <Image
                    source={
                      data.photoURL
                        ? {uri: `${data.photoURL}`}
                        : require('../../assets/dummy.png')
                    }
                    style={{width: '100%', height: '100%'}}
                  />
                  <TouchableOpacity
                    style={{position: 'absolute', top: 15, right: 15}}>
                    <View>
                      <Close
                        name="closecircleo"
                        color={'black'}
                        size={40}
                        onPress={() => {
                          this._setModalVisible(!modalVisible);
                        }}
                      />
                    </View>
                  </TouchableOpacity>
                </View>
              </View>
            </Modal>
            <TouchableOpacity
              style={{marginBottom: -25}}
              activeOpacity={!data.photoURL && 1}
              onPress={() => data.photoURL && this._setModalVisible(true)}>
              <Image
                source={
                  data.photoURL
                    ? {uri: `${data.photoURL}`}
                    : require('../../assets/dummy.png')
                }
                style={{width: '100%', height: 225}}
              />
            </TouchableOpacity>
            <TouchableOpacity style={{position: 'absolute', top: 10, left: 10}}>
              <View
                style={{
                  backgroundColor: 'white',
                  borderRadius: 100,
                  height: 40,
                  width: 40,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Back
                  name="arrow-left"
                  color={'black'}
                  size={22}
                  onPress={() => this.props.navigation.goBack()}
                />
              </View>
            </TouchableOpacity>
          </View>
          <View
            style={{
              paddingHorizontal: 15,
              paddingTop: 10,
              backgroundColor: 'white',
            }}>
            <CText style={{fontSize: 30, fontWeight: 'bold', color: 'black'}}>
              {data.namabarang}
            </CText>
            <View style={{paddingTop: 15}}>
              <View style={{flexDirection: 'row'}}>
                <View style={{width: '55%'}}>
                  <Text style={{color: 'grey'}}>Dipost pada:</Text>
                  <View style={{paddingVertical: 5, flexDirection: 'row', paddingTop: 10}}>
                    <View style={{justifyContent: 'center', alignItems: 'center'}}>
                      <Date name="date" size={30} color="#00ca74" />
                    </View>
                    <View style={{paddingHorizontal: 7}}>
                      <Text
                        style={{
                          color: 'black',
                          fontWeight: 'bold',
                          fontSize: 15,
                        }}>
                        Disini tgl bulan tahun
                      </Text>
                      <Text style={{fontSize: 14}}>Pukul: disini jam</Text>
                    </View>
                  </View>
                </View>
                <View style={{width: '35%'}}>
                  <Text>Ditemukan di: </Text>
                  <View style={{flexDirection: 'row', alignItems: 'center', paddingTop: 15}}>
                    <View style={{justifyContent: 'center', alignContent: 'center'}}>
                    <EvilIcons name="location" size={40} color='#00ca74' />
                    </View>
                    <Text style={{color: 'black', fontSize: 15, fontWeight: 'bold'}}>{data.lokasi}</Text>
                  </View>
                </View>
              </View>
            </View>
          </View>
          <View style={{padding: 5, backgroundColor: 'white', marginBottom: 3}}>
            <CText style={{fontSize: 25}}>Deskripsi</CText>
            <Text style={styles.textcolor}>Kategori: {data.kategori}</Text>
            {data.keyunik?<Text style={styles.textcolor}>Ciri2: {data.keyunik}</Text>:<></>}
            {data.hadiah?<Text style={styles.textcolor}>Hadiah: {data.hadiah}</Text>:<></>}
            {data.deskripsi?<Text style={styles.textcolor}>Deskripsi detail: {data.deskripsi}</Text>:<></>}
            <Text style={styles.textcolor}>{convertDateOnly(new Date(params.time.seconds*1000))}</Text>
            <Text style={styles.textcolor}>{getHour(new Date(params.time.seconds*1000))}</Text>
          </View>
          <View
            style={{
              padding: 5,
              flexDirection: 'row',
              backgroundColor: 'white',
              marginBottom: 3,
              justifyContent: 'space-between',
            }}>
            <View style={{flexDirection: 'row'}}>
              <View style={{marginRight: 10}}>
                <Image
                  style={styles.avatar}
                  source={{
                    uri: data.ppURL
                      ? data.ppURL
                      : 'https://www.shareicon.net/data/2016/09/01/822742_user_512x512.png',
                  }}
                />
              </View>
              <View style={{justifyContent: 'center'}}>
                <Text style={{color: 'grey'}}>Dipost oleh:</Text>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <Text
                    style={{
                      fontWeight: 'bold',
                      color: 'black',
                      borderRadius: 5,
                      paddingHorizontal: 8,
                      backgroundColor: 'lightgreen',
                    }}>
                    {data.displayName}
                  </Text>
                  {isVerified.length > 0 && (
                    <Verified name="verified-user" size={25} color="black" />
                  )}
                </View>
              </View>
            </View>
            {data.uid != user.uid && (
              <View style={{justifyContent: 'center', marginRight: 25}}>
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate('Messaging', {
                      displayName: data.displayName,
                      uid: data.uid,
                      ppURL: data.ppURL,
                    })
                  }>
                  <Ionicons
                    name="md-chatbox-ellipses-outline"
                    size={40}
                    color="black"
                  />
                  {/* <Text style={{color: 'black'}}>Chat</Text> */}
                </TouchableOpacity>
              </View>
            )}
          </View>
          <TouchableOpacity
            activeOpacity={0.6}
            onPress={() => {
              this._setModalVisibleComment(true);
            }}
            style={{backgroundColor: 'white'}}>
            <View
              style={{
                padding: 5,
                backgroundColor: 'white',
                height: '100%',
              }}>
              <View style={{flexDirection: 'row'}}>
                <CText>Komentar</CText>
                <CText> {dataComments.length + dataCommentsChild.length}</CText>
              </View>
              <View style={{}}>
                {dataComments &&
                  dataComments
                    .map((x, i) => {
                      return (
                        <View
                          key={i}
                          style={
                            {marginLeft: 10, marginTop: 10}
                            //   x.uid != user.uid ?
                            // {} : {}
                          }>
                          <View
                            style={{
                              flexDirection: 'row',
                              alignItems: 'center',
                            }}>
                            <Image
                              style={{
                                width: 30,
                                height: 30,
                                borderRadius: 150 / 2,
                                borderWidth: 1,
                                borderColor: 'black',
                                marginRight: 10,
                              }}
                              source={{
                                uri: x.photoURL
                                  ? x.photoURL
                                  : 'https://www.shareicon.net/data/2016/09/01/822742_user_512x512.png',
                              }}
                            />
                            <View style={{flexDirection: 'row'}}>
                              <Text
                                style={
                                  data.uid == x.uid
                                    ? {
                                        borderRadius: 5,
                                        paddingHorizontal: 8,
                                        backgroundColor: 'lightgreen',
                                        fontWeight: 'bold',
                                        color: 'black',
                                      }
                                    : {
                                        fontWeight: 'bold',
                                        color: 'black',
                                      }
                                }>
                                {x.displayName}
                              </Text>
                              {isVerified.length > 0 && (
                                <Verified
                                  name="verified-user"
                                  size={25}
                                  color="black"
                                />
                              )}
                            </View>
                          </View>
                          <Text style={{...styles.textcolor, marginLeft: 40}}>
                            {x.comment}
                          </Text>
                        </View>
                      );
                    })
                    .slice(0, 1)}
              </View>
            </View>
          </TouchableOpacity>
          <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisibleComment}
            onRequestClose={() => {
              this._setModalVisibleComment(false);
            }}>
            <TouchableOpacity
              style={{backgroundColor: 'transparent', height: '26%'}}
              activeOpacity={1}
              onPressOut={() => {
                this._setModalVisibleComment(false);
              }}></TouchableOpacity>
            <View
              style={{
                height: '74%',
                marginTop: 'auto',
                borderTopRightRadius: 25,
                borderTopLeftRadius: 25,

                borderWidth: 1,
                borderColor: 'black',
                backgroundColor: 'white',
              }}>
              <View
                style={{
                  borderTopRightRadius: 25,
                  borderTopLeftRadius: 25,
                  backgroundColor: 'black',
                  borderBottomColor: 'black',
                  borderBottomWidth: 1,
                  height: 65,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Text
                  style={{color: 'white', fontWeight: 'bold', fontSize: 20}}>
                  Komentar
                </Text>
              </View>
              <ScrollView>
                <View style={{marginTop: 10}}>
                  {dataComments &&
                    dataComments.map((x, i) => {
                      return (
                        <TouchableOpacity
                          onPress={() => {
                            this._setModalVisibleComment(false);
                            navigation.navigate('ReplyScreen', {
                              ...x,
                              postID: data.uid + data.postID,
                            });
                          }}
                          key={i}
                          style={
                            {marginLeft: 10, marginTop: 10}
                            //   x.uid != user.uid ?
                            // {} : {}
                          }>
                          <View
                            style={{
                              flexDirection: 'row',
                              alignItems: 'center',
                            }}>
                            <Image
                              style={{
                                width: 30,
                                height: 30,
                                borderRadius: 150 / 2,
                                borderWidth: 1,
                                borderColor: 'black',
                                marginRight: 10,
                              }}
                              source={{
                                uri: x.photoURL
                                  ? x.photoURL
                                  : 'https://www.shareicon.net/data/2016/09/01/822742_user_512x512.png',
                              }}
                            />
                            <View style={{flexDirection: 'row'}}>
                              <Text
                                style={
                                  data.uid == x.uid
                                    ? {
                                        borderRadius: 5,
                                        paddingHorizontal: 8,
                                        backgroundColor: 'lightgreen',
                                        fontWeight: 'bold',
                                        color: 'black',
                                      }
                                    : {
                                        fontWeight: 'bold',
                                        color: 'black',
                                      }
                                }>
                                {x.displayName}
                              </Text>
                              {isVerified.length > 0 && (
                                <Verified
                                  name="verified-user"
                                  size={25}
                                  color="black"
                                />
                              )}
                            </View>
                          </View>
                          <Text style={{...styles.textcolor, marginLeft: 40}}>
                            {x.comment}
                          </Text>
                          {dataCommentsChild &&
                            dataCommentsChild.map((y, i) => {
                              let check;
                              if (
                                x.commentID == y.commentID &&
                                y.commentID == x.commentID
                              ) {
                                check = true;
                                // console.log(check);
                              }
                              if (check == true) {
                                return (
                                  <View
                                    key={i}
                                    style={
                                      {
                                        marginLeft: 10,
                                        marginTop: 10,
                                        borderLeftWidth: 1,
                                        borderColor: 'silver',
                                      }
                                      //   params.uid != user.uid ?
                                      // {} : {}
                                    }>
                                    <View
                                      style={{
                                        marginLeft: 10,
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                      }}>
                                      <Image
                                        style={{
                                          width: 30,
                                          height: 30,
                                          borderRadius: 150 / 2,
                                          borderWidth: 1,
                                          borderColor: 'black',
                                          marginRight: 10,
                                        }}
                                        source={{
                                          uri: y.photoURL
                                            ? y.photoURL
                                            : 'https://www.shareicon.net/data/2016/09/01/822742_user_512x512.png',
                                        }}
                                      />
                                      <View
                                        style={
                                          data.uid == y.uid && {
                                            borderRadius: 5,
                                            paddingHorizontal: 8,
                                            backgroundColor: 'lightgreen',
                                          }
                                        }>
                                        <Text
                                          style={{
                                            ...styles.textcolor,
                                            fontWeight: 'bold',
                                          }}>
                                          {y.displayName}
                                        </Text>
                                      </View>
                                    </View>
                                    <Text
                                      style={{
                                        ...styles.textcolor,
                                        marginLeft: 50,
                                      }}>
                                      {y.comment}
                                    </Text>
                                  </View>
                                );
                              }
                            })}
                        </TouchableOpacity>
                      );
                    })}
                </View>
              </ScrollView>
              <TouchableOpacity
                style={{position: 'absolute', top: 15, right: 15}}>
                <View>
                  <Close
                    name="closecircleo"
                    color={'white'}
                    size={40}
                    onPress={() => {
                      this._setModalVisibleComment(false);
                    }}
                  />
                </View>
              </TouchableOpacity>
              <View
                style={{
                  flexDirection: 'row',
                  marginTop: 15,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <TextInput
                  placeholder="comment..."
                  placeholderTextColor={'grey'}
                  value={comment}
                  color={'black'}
                  onChangeText={value => this.setState({comment: value})}
                  style={{
                    borderBottomWidth: 1,
                    borderColor: 'black',
                    alignItems: 'center',
                    width: '60%',
                  }}
                />
                <Button
                  title="comment"
                  onPress={() => comment && this._postcomment()}
                />
              </View>
            </View>
          </Modal>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'darkgrey',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 63,
    borderWidth: 1,
    borderColor: 'black',
    margin: 10,
  },
  textcolor: {color: 'black'},
});
const mapStateToProps = state => {
  return {
    user: state.user,
  };
};

export default connect(mapStateToProps)(DetailsScreen);
