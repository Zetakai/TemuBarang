import React, {Component} from 'react';
import {
  Text,
  StyleSheet,
  View,
  TouchableOpacity,
  ScrollView,
  Modal,
  TextInput
} from 'react-native';

import firestore from '@react-native-firebase/firestore';
import CTextInput from '../../components/atoms/CTextInput';
import CButton from '../../components/atoms/CButton';
import {IconBack} from '../../assets/iconback';
import {connect} from 'react-redux';
import CImageCircle from '../../components/CImageCircle';
import {colors, fonts, responsiveWidth} from '../../components/utils/Utility';
import {convertDateTime} from '../../components/utils/moment';
import CGap from '../../components/CGap';
import {convertDate} from '../../components/utils/Utility/util/date';
import CBubbleText from '../../components/CBubbleText';
import Delete from 'react-native-vector-icons/Feather';
import Send from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  getHour,
  convertDayMonthOnly,
  convertDateOnly,
} from '../../components/utils/moment';

export class Message extends Component {
  constructor(props) {
    super(props);

    this.state = {
      target: this.props.route.params,
      messages: [],
      inputText: '',
      validationCode: '',
      post: null,
      modalConfirm: false,
    };
    let mounted;
  }

  _setModalVisible = visible => {
    this.setState({modalConfirm: visible});
  };

  componentDidMount() {
    const {user} = this.props;
    const {params} = this.props.route;
    const {target, messages} = this.state;
    this.mounted = true;
    firestore()
      .collection('Message')
      .doc(user.uid)
      .collection('chatWith')
      .doc(params.uid)
      .onSnapshot(res => {
        if (res)
          if (res.data())
            this.mounted == true &&
              this.setState({
                messages: res.data()?.messages,
                post: res.data().post,
              });
      });
  }

  _send = () => {
    const {user} = this.props;
    const {params} = this.props.route;
    const {target, inputText, post} = this.state;
    params.data
      ? firestore()
          .collection('Message')
          .doc(user.uid)
          .collection('chatWith')
          .doc(params.uid)
          .set(
            {
              messages: firestore.FieldValue.arrayUnion({
                text: inputText,
                sendBy: user.uid,
                time: new Date(),
              }),
              lastChat: {
                uid: params.uid,
                text: inputText,
                ppURL: params.ppURL ? params.ppURL : '',
                time: new Date(),
                displayName: params.displayName,
              },
              post: params.data,
            },
            {merge: true},
          )
          .then(() => {
            this.setState({inputText: ''});
          })
      : firestore()
          .collection('Message')
          .doc(user.uid)
          .collection('chatWith')
          .doc(params.uid)
          .set(
            {
              messages: firestore.FieldValue.arrayUnion({
                text: inputText,
                sendBy: user.uid,
                time: new Date(),
              }),
              lastChat: {
                uid: params.uid,
                text: inputText,
                ppURL: params.ppURL ? params.ppURL : '',
                time: new Date(),
                displayName: params.displayName,
              },
            },
            {merge: true},
          )
          .then(() => {
            this.setState({inputText: ''});
          });

    params.data
      ? firestore()
          .collection('Message')
          .doc(params.uid)
          .collection('chatWith')
          .doc(user.uid)
          .set(
            {
              messages: firestore.FieldValue.arrayUnion({
                text: inputText,
                sendBy: user.uid,
                time: new Date(),
              }),
              lastChat: {
                uid: user.uid,
                text: inputText,
                ppURL: user.photoURL ? user.photoURL : '',
                time: new Date(),
                displayName: user.displayName,
              },
              post: params.data,
            },
            {merge: true},
          )
      : firestore()
          .collection('Message')
          .doc(params.uid)
          .collection('chatWith')
          .doc(user.uid)
          .set(
            {
              messages: firestore.FieldValue.arrayUnion({
                text: inputText,
                sendBy: user.uid,
                time: new Date(),
              }),
              lastChat: {
                uid: user.uid,
                text: inputText,
                ppURL: user.photoURL ? user.photoURL : '',
                time: new Date(),
                displayName: user.displayName,
              },
            },
            {merge: true},
          );
  };

  _deleteMessage = () => {
    const {user, navigation} = this.props;
    const {params} = this.props.route;
    firestore()
      .collection('Message')
      .doc(user.uid)
      .collection('chatWith')
      .doc(params.uid)
      .delete()
      .then(() => navigation.replace('TabNav'));
  };
  componentWillUnmount() {
    this.mounted = false;
  }
  _validate = () => {
    const {user} = this.props;
    const {params} = this.props.route;
    this.setState({
      validationCode: Math.floor(100000 + Math.random() * 900000),
    });
    firestore()
      .collection('Validation')
      .doc(params.uid)
      .collection('ValidateWith')
      .doc(user.uid)
      .set({
        targetuid: params.uid,
        senderuid: user.uid,
        code: validationCode,
      });
  };

  render() {
    const {navigation, dataUse, route, data, uid, user} = this.props;
    const {params} = this.props.route;
    // const {data,uid}=navigation.route.params

    // const {image, name} = this.state.params;
    const {inputText, messages, post, modalConfirm} = this.state;

    return (
      <View style={styles.page}>
        <View style={styles.topBar}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <TouchableOpacity
                  style={{marginRight: 40}}
                  onPress={() => {
                    navigation.goBack('');
                  }}>
                  <IconBack />
                </TouchableOpacity>
                <CImageCircle
                  image={{uri: params.ppURL}}
                  height={responsiveWidth(40)}
                  width={responsiveWidth(40)}
                />
              </View>
              <Text style={styles.name}>{params.displayName}</Text>
            </View>
            <TouchableOpacity
              style={
                {
                  // position: 'absolute', top: 10, right: 20
                }
              }
              onPress={() => {
                this._deleteMessage();
              }}>
              <Delete color={'black'} name="trash-2" size={30} />
            </TouchableOpacity>
          </View>
          <View style={{flexDirection: 'row', justifyContent: 'space-evenly'}}>
            <TouchableOpacity
              onPress={() =>
                post != null
                  ? this.props.navigation.navigate('DetailsScreen', post)
                  : this.props.navigation.goBack()
              }
              style={{
                marginTop: 15,
                borderRadius: 25,
                height: 40,
                width: '25%',
                borderWidth: 1,
                borderColor: 'black',
                backgroundColor: 'lightblue',
                alignSelf: 'center',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Text style={{color: 'black'}}>Ke Post</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                marginTop: 15,
                borderRadius: 25,
                height: 40,
                width: '70%',
                borderWidth: 1,
                borderColor: 'black',
                backgroundColor: 'pink',
                alignSelf: 'center',
                justifyContent: 'center',
                alignItems: 'center',
              }}
              onPress= {()=>{this._setModalVisible(!modalConfirm)}}>
              <Text style={{color: 'black'}}>Konfirmasi Barang Kembali</Text>
            </TouchableOpacity>
          </View>
        </View>
        <ScrollView
          style={{flex: 1, paddingHorizontal: 17, paddingTop: 15}}
          ref={ref => {
            this.scrollView = ref;
          }}
          onContentSizeChange={() =>
            this.scrollView.scrollToEnd({animated: true})
          }>
          {messages ? (
            messages.map((value, index, array) => {
              let timenow = Math.round(new Date().valueOf() / 1000);

              return (
                <View key={index}>
                  <CBubbleText
                    isMe={value.sendBy == user.uid}
                    text={value.text}
                  />
                  <Text
                    style={{
                      marginBottom: 20,
                      color: 'silver',
                      alignSelf:
                        value.sendBy == user.uid ? 'flex-end' : 'flex-start',
                    }}>
                    {timenow - value.time.seconds < 86400
                      ? getHour(new Date(value.time.seconds * 1000))
                      : timenow - value.time.seconds < 31536000
                      ? convertDayMonthOnly(new Date(value.time.seconds * 1000))
                      : convertDateOnly(new Date(value.time.seconds * 1000))}
                  </Text>
                </View>
              );
            })
          ) : (
            <Text style={{color: 'black'}}>Start new convertation</Text>
          )}
          {/* <View style={styles.leftChat}>
            <Text>
              Lorem ipsum dolor sit amet Lorem ipsum dolor sit amet Lorem Lorem
              ipsum dolor sit amet Lorem ipsum dolor Lor...
            </Text>
            <Text>14 November 2020</Text>
          </View>
          <View style={styles.rightChat}>
            <Text>
              Lorem ipsum dolor sit amet Lorem ipsum dolor sit amet Lorem Lorem
              ipsum dolor sit amet Lorem ipsum dolor Lor...
            </Text>
          </View> */}
        </ScrollView>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-evenly',
            alignItems: 'center',
          }}>
          <CTextInput
            width={responsiveWidth(320)}
            borderWidth={0.2}
            value={inputText}
            onChangeText={inputText => {
              this.setState({inputText});
            }}
          />
          <TouchableOpacity
            activeOpacity={inputText ? 0.6 : 1}
            onPress={() => inputText && this._send()}>
            <Send color={'dimgrey'} name="send-outline" size={30} />
          </TouchableOpacity>
        </View>
        <CGap height={15} />
          <Modal
            animationType="fade"
            transparent
            visible={modalConfirm}
            onRequestClose={() => {
              this._setModalVisible(!modalConfirm);
            }}>
            <View
              style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
              <View
                style={{
                  width: '75%',
                  height: 400,
                  backgroundColor: 'white',
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
                    Konfirmasi
                  </Text>
                </View>
                <View
                  style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    padding: 10,
                  }}>
                  <Text>Kode Konfirmasi :</Text>
                  <Text style={{fontSize: 25, color: 'black'}}>KOde disini</Text>
                </View>
                <View
                  style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    paddingHorizontal: 10,
                  }}>
                  <Text
                    style={{fontSize: 15, textAlign: 'center'}}>
                    Kode :
                  </Text>
                  <TextInput
                  placeholder='Kode'
                    style={{letterSpacing: 5, height: 60, width: 150, backgroundColor: '#eeeeee', fontSize: 30, textAlign: 'center'}}
                  />
                </View>
                <View
                  style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    padding: 10,
                  }}>
                  <Text style={{fontSize: 14, color: 'black', textAlign: 'justify'}}>Minta lawan chat anda untuk mengisikan Kode Konfirmasi di atas, lalu minta Kode Konfirmasi dia untuk anda isikan di bagian Kode di atas.</Text>
                </View>
                <View
                  style={{
                    position: 'absolute',
                    bottom: 0,
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    paddingHorizontal: 10,
                    paddingBottom: 15,
                    marginTop: 10,
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
                      backgroundColor: '#eeeeee',
                    }}
                    onPress={() => {
                      this._setModalVisible(!modalConfirm);
                    }}>
                    <Text
                      style={{
                        fontWeight: 'bold',
                        fontSize: 15,
                        color: '#00ca74',
                      }}>
                      BATAL
                    </Text>
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
                    <Text style={{fontWeight: 'bold', fontSize: 15}}>
                      KONFIRMASI
                    </Text>
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
  page: {
    flex: 1,
    paddingTop: 30,
  },
  topBar: {
    marginTop: 1,
    borderBottomWidth: 2,
    borderBottomColor: 'black',
    paddingHorizontal: 20,
    paddingBottom: 10,
  },
  name: {
    color: 'black',
    marginLeft: 15,
    fontFamily: fonts.primary.medium,
    fontSize: 17,
  },
  leftChat: {
    maxWidth: responsiveWidth(280),
    padding: 10,
    backgroundColor: colors.lightYellow,
    borderRadius: 10,
    marginBottom: 40,
    left: 0,
  },
  rightChat: {
    maxWidth: responsiveWidth(280),
    padding: 10,
    backgroundColor: colors.lightBlue,
    borderRadius: 10,
    right: 0,
    marginLeft: responsiveWidth(100),
  },
});
const mapStateToProps = state => {
  return {
    user: state.user,
  };
};

export default connect(mapStateToProps)(Message);
