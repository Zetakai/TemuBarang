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
import Verified from 'react-native-vector-icons/MaterialIcons';
export class ReplyScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      comment: '',
      dataComments: [],
      modalVisible: false,
      modalVisibleComment: false,
      dataCommentsChild: [],isVerified:false,isVerifiedAll:[]
    };let mounted
  }
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
  _isVerifiedAll = async () => {
    const {user} = this.props;
    const {params} = this.props.route;
    await firestore()
      .collection('VerifiedAccounts')
      .doc('Official')
      .get().then(x=>x.data().Users).then(x=>this.setState({isVerifiedAll: x}))

   
  };
  async componentDidMount() {
    const {params} = this.props.route;
    const {data, showModal} = this.state;
    this.setState({data: params});
    console.log(params)
    this.mounted = true;
this._isVerified()
this._isVerifiedAll()
    await firestore()
      .collection('CommentsChild')
      .doc(`${params.postID}`)
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
  _postcommentChild = async () => {
    const {params} = this.props.route;
    const {data, comment} = this.state;
    const {user} = this.props;
    await firestore()
      .collection(`CommentsChild`)
      .doc(`${params.postID}`)
      .set(
        {
          comments: firestore.FieldValue.arrayUnion({
            commentID: params.commentID,
            displayName: user.displayName,
            photoURL: user.photoURL,
            comment: comment,
            time: new Date(),
            uid: user.uid,
          }),
        },
        {merge: true},
      )
      .then(this.mounted==true&&this.setState({comment: ''}));
  };
  componentWillUnmount(){this.mounted=false}
  render() {
    const {params} = this.props.route;
    const {
      data,
      comment,
      dataComments,
      dataCommentsChild,
      modalVisible,
      modalVisibleComment,isVerified,isVerifiedAll
    } = this.state;
    const {user} = this.props;
    return (
      <View>
        <View
          style={
            {marginLeft: 10, marginTop: 10}
            //   params.uid != user.uid ?
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
                uri: params.photoURL
                  ? params.photoURL
                  : 'https://www.shareicon.net/data/2016/09/01/822742_user_512x512.png',
              }}
            />
            <View style={{flexDirection: 'row'}}>
                              <Text
                                style={
                                  data.uid == data.poster
                                    ? {
                                        borderRadius: 5,
                                        paddingHorizontal: 8,
                                        backgroundColor: 'lightgreen',
                                        fontWeight: 'bold',
                                        color: 'black',
                                      }
                                    : {paddingLeft:8,
                                        fontWeight: 'bold',
                                        color: 'black',
                                      }
                                }>
                                {params.displayName}
                              </Text>
                              {isVerifiedAll.some(v=>v.uid==params.uid) && (
                                 <Verified
                                 style ={{marginLeft:5}}
                                   name="verified-user"
                                   size={25}
                                   color="darkgreen"
                                 />
                              )}
                            </View>
          </View>
          <Text style={{...styles.textcolor, marginLeft: 48}}>
            {params.comment}
          </Text>
          {dataCommentsChild &&
            dataCommentsChild.map((x, i) => {
              let check;
              if (x.commentID == params.commentID && params.commentID == x.commentID) {
                check = true;
                // console.log(check);
              }
              if (check == true) {
                return (
                  <View
                    key={i}
                    style={
                      {
                        marginLeft: 14,
                        marginTop: 10,
                        borderLeftWidth: 1,
                        borderColor: 'silver',
                      }
                      //   x.uid != user.uid ?
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
                          uri: x.photoURL
                            ? x.photoURL
                            : 'https://www.shareicon.net/data/2016/09/01/822742_user_512x512.png',
                        }}
                      />
                      <View style={{flexDirection: 'row'}}>
                              <Text
                                style={
                                  data.poster == x.uid
                                    ? {
                                        borderRadius: 5,
                                        paddingHorizontal: 8,
                                        backgroundColor: 'lightgreen',
                                        fontWeight: 'bold',
                                        color: 'black',
                                      }
                                    : {paddingLeft:8,
                                        fontWeight: 'bold',
                                        color: 'black',
                                      }
                                }>
                                {x.displayName}
                              </Text>
                              {isVerifiedAll.some(v=>v.uid==x.uid)&& (
                                 <Verified
                                 style ={{marginLeft:5}}
                                   name="verified-user"
                                   size={25}
                                   color="darkgreen"
                                 />
                              )}
                            </View>
                    </View>
                    <Text style={{...styles.textcolor, marginLeft: 58}}>
                      {x.comment}
                    </Text>
                  </View>
                );
              }
            })}
        </View>
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
            onPress={() => comment && this._postcommentChild()}
          />
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
    borderWidth: 3,
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

export default connect(mapStateToProps)(ReplyScreen);
