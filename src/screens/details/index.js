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

export default class Index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      comment: '',
      dataComments: [],
      modalVisible: false,
      modalVisibleComment: false,
    };
  }
  _setModalVisible = visible => {
    this.setState({modalVisible: visible});
  };
  _setModalVisibleComment = visible => {
    this.setState({modalVisibleComment: visible});
  };
  async componentDidMount() {
    const {params} = this.props.route;
    const {data, showModal} = this.state;
    this.setState({data: params});
    this.mounted = true;
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
  }
  componentWillUnmount() {
    this.setState({modalVisible: false});
    this.mounted = false;
  }
  _postcomment = async () => {
    const {data, comment} = this.state;
    await firestore()
      .collection('Comments')
      .doc(`${data.uid}` + `${data.postID}`)
      .set(
        {
          comments: firestore.FieldValue.arrayUnion({
            displayName: auth().currentUser.displayName,
            photoURL: auth().currentUser.photoURL,
            comment: comment,
            time: new Date(),
            uid: auth().currentUser.uid,
          }),
        },
        {merge: true},
      )
      .then(this.setState({comment: ''}));
  };
  render() {
    const {navigation} = this.props;
    const {data, comment, dataComments, modalVisible, modalVisibleComment} =
      this.state;

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
              activeOpacity={!data.photoURL && 1}
              onPress={() => data.photoURL && this._setModalVisible(true)}>
              <Image
                source={
                  data.photoURL
                    ? {uri: `${data.photoURL}`}
                    : require('../../assets/dummy.png')
                }
                style={{width: '100%', height: 200}}
              />
            </TouchableOpacity>
          </View>
          <View style={{padding: 5, backgroundColor: 'white'}}>
            <CText style={{fontSize: 30, fontWeight: 'bold'}}>
              {data.namabarang}
            </CText>
            <Text style={styles.textcolor}>Lokasi : {data.lokasi}</Text>
          </View>
          <View style={{padding: 5, backgroundColor: 'white', marginBottom: 3}}>
            <CText style={{fontSize: 25}}>Deskripsi</CText>
            <Text style={styles.textcolor}>Kategori: {data.kategori}</Text>
            <Text style={styles.textcolor}>Ciri2: {data.keyunik}</Text>
            <Text style={styles.textcolor}>Hadiah: {data.hadiah}</Text>

            <Text style={styles.textcolor}>{data.uid}</Text>
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
                <Text style={styles.textcolor}>Diposting oleh</Text>
                <Text style={{color: 'darkgreen'}}>{data.displayName}</Text>
              </View>
            </View>
            <View>
              <CButton
                style={{marginBottom: 10, backgroundColor: '#AFA69F'}}
                title={'HUBUNGI'}
                onPress={() =>
                  navigation.navigate('Messaging', {
                    displayName: data.displayName,
                    uid: data.uid,
                    ppURL: data.ppURL,
                  })
                }
              />
            </View>
          </View>
          <TouchableOpacity
            activeOpacity={0.6}
            onPress={() => {
              this._setModalVisibleComment();
            }}
            style={{backgroundColor: 'white'}}>
            <View
              style={{
                padding: 5,
                backgroundColor: 'white',
                height: '100%',
              }}><View style={{flexDirection:'row'}}>
              <CText>Komentar</CText><CText>  {dataComments.length}</CText></View>
              <View
                style={{}}>
                {dataComments &&
                  dataComments.map((x, i) => {
                    return (
                      <View
                        key={i}
                        style={{marginLeft:10,marginTop:10}
                        //   x.uid != auth().currentUser.uid ? 
                        // {} : {}
                      }
                        >
                        <View style={{flexDirection: 'row',alignItems:'center'}}>
                          <Image
                            style={{width: 30,
                              height: 30,
                              borderRadius: 150 / 2,
                              borderWidth: 1,
                              borderColor: 'black',marginRight:10}}
                            source={{
                              uri:x.photoURL
                                ?x.photoURL
                                : 'https://www.shareicon.net/data/2016/09/01/822742_user_512x512.png',
                            }}
                          />
                          <Text
                            style={{...styles.textcolor, fontWeight: 'bold'}}>
                            {x.displayName}
                          </Text>
                        </View>
                        <Text style={{...styles.textcolor,marginLeft:40}}>{x.comment}</Text>
                      </View>
                    );
                  }).slice(0,1)}
              </View>
            </View>
          </TouchableOpacity>
          <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisibleComment}
            onRequestClose={() => {
              this._setModalVisibleComment(!modalVisibleComment);
            }}><TouchableOpacity 
            style={{backgroundColor:'transparent',height:'26%'}} 
            activeOpacity={1} 
            onPressOut={() => {this._setModalVisibleComment(false)}}
          ></TouchableOpacity>
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
                  style={{color:'white',
                    fontWeight: 'bold',
                    fontSize: 20,
                  }}>
                  Komentar
                </Text>
              </View>
              <ScrollView>
                <View style={{marginTop: 10}}>
                {dataComments &&
                  dataComments.map((x, i) => {
                    return (
                      <View
                        key={i}
                        style={{marginLeft:10,marginTop:10}
                        //   x.uid != auth().currentUser.uid ? 
                        // {} : {}
                      }
                        >
                        <View style={{flexDirection: 'row',alignItems:'center'}}>
                          <Image
                            style={{width: 30,
                              height: 30,
                              borderRadius: 150 / 2,
                              borderWidth: 1,
                              borderColor: 'black',marginRight:10}}
                            source={{
                              uri:x.photoURL
                                ?x.photoURL
                                : 'https://www.shareicon.net/data/2016/09/01/822742_user_512x512.png',
                            }}
                          />
                          <Text
                            style={{...styles.textcolor, fontWeight: 'bold'}}>
                            {x.displayName}
                          </Text>
                        </View>
                        <Text style={{...styles.textcolor,marginLeft:40}}>{x.comment}</Text>
                      </View>
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
                      this._setModalVisibleComment(!modalVisibleComment);
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
    borderWidth: 3,
    borderColor: 'black',
    margin: 10,
  },
  textcolor: {color: 'black'},
});
