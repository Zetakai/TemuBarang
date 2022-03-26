import React, {Component} from 'react';
import {
  Text,
  StyleSheet,
  View,
  TouchableOpacity,
  ScrollView,
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
    };
  }

  componentDidMount() {
    const {user} = this.props;
    const {params} = this.props.route;
    const {target, messages} = this.state;
    firestore()
      .collection('Message')
      .doc(user.uid)
      .collection('chatWith')
      .doc(params.uid)
      .onSnapshot(res => {
        if (res)
          if (res.data()) this.setState({messages: res.data()?.messages});
      });
  }

  _send = () => {
    const {user} = this.props;
    const {params} = this.props.route;
    const {target, inputText} = this.state;
    firestore()
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

    firestore()
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
    const {user,navigation} = this.props;
    const {params} = this.props.route;
    firestore()
      .collection('Message')
      .doc(user.uid)
      .collection('chatWith')
      .doc(params.uid)
      .delete().then(()=>navigation.replace('TabNav'))
  };
  componentWillUnmount() {
    this.mounted = false;
  }

  render() {
    const {navigation, dataUse, route, data, uid, user} = this.props;
    const {params} = this.props.route;
    // const {data,uid}=navigation.route.params

    // const {image, name} = this.state.params;
    const {inputText, messages} = this.state;

    return (
      <View style={styles.page}>
        <View style={styles.topBar}>
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
          <Text style={styles.name}>{params.displayName}</Text>
          <TouchableOpacity
            style={{position: 'absolute', top: 0, right: 0}}
            onPress={() => {
              this._deleteMessage();
            }}>
            <Delete color={'black'} name="trash-2" size={30} />
          </TouchableOpacity>
        </View>
        <ScrollView style={{flex: 1}}>
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
            justifyContent: 'space-between',
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
          <TouchableOpacity onPress={() => this._send()}>
            <CImageCircle
              image={require('../../assets/Arrow-Right.svg')}
              width={responsiveWidth(40)}
              height={responsiveWidth(40)}
              backgroundColor={colors.primary}
            />
          </TouchableOpacity>
        </View>
        <CGap height={15} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    paddingHorizontal: 17,
    paddingTop: 30,
  },
  topBar: {
    flexDirection: 'row',
    marginBottom: 15,
    alignItems: 'center',
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
