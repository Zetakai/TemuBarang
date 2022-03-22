

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
import { IconBack } from '../../assets/iconback';
import { connect } from 'react-redux';

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
    // const {user} = this.props;
    // const {target, messages} = this.state;
    // firestore()
    //   .collection('messages')
    //   .doc(user.uid)
    //   .collection('chatWith')
    //   .doc(target.uid)
    //   .onSnapshot(res => {
    //     this.setState({messages: res.data()?.messages});
    //   });
  }

  _send = () => {
    const {user} = this.props;
    const {params} = this.props.route;
    const {target, inputText} = this.state;
    firestore()
      .collection('messages')
      .doc(user.uid)
      .collection('chatWith')
      .doc(params.uid)
      .set(
        {
          messages: firestore.FieldValue.arrayUnion({
            text: 'inputText',
            sendBy: user.uid,
            time: new Date(),
          }),
          lastChat: {
            uid: params.uid,
            text: 'inputText',
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
      .collection('messages')
      .doc(params.uid)
      .collection('chatWith')
      .doc(user.uid)
      .set(
        {
          messages: firestore.FieldValue.arrayUnion({
            text: 'inputText',
            sendBy: user.uid,
            time: new Date(),
          }),
          lastChat: {
            uid: user.uid,
            text: 'inputText',
            ppURL: user.photoURL ? user.photoURL : '',
            time: new Date(),
            displayName: user.displayName,
          },
        },
        {merge: true},
      );
  };

  render() {
    const {navigation, dataUse,route,data,uid,user} = this.props;
    const {params} = this.props.route;
    // const {data,uid}=navigation.route.params
    console.log(params)
    // const {image, name} = this.state.params;
    const {inputText, messages} = this.state;
    return (
      <View style={styles.page}>
        <View style={styles.topBar}>
          <TouchableOpacity
            style={{marginRight: 40}}
            onPress={() => {
              navigation.goBack();
            }}>
           <IconBack/> 
          </TouchableOpacity>

         
          <Text style={styles.name}> {params.displayName}</Text>
          
        </View>
        <ScrollView style={{flex: 1}}>
          <Text>{uid}</Text>
          <Text></Text>
        
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
           
           />
           <CButton onPress={() => this._send()}/>
          <TouchableOpacity >
          
          </TouchableOpacity>
        </View>
        
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
    marginLeft: 15,
    color:'black',
    fontSize: 17,
  },
  leftChat: {
   
    padding: 10,
    backgroundColor:'#456',
    borderRadius: 10,
    marginBottom: 40,
    left: 0,
  },
  rightChat: {

    padding: 10,
    backgroundColor:'#646ddf',
    borderRadius: 10,
    right: 0,
    
  },
});
const mapStateToProps = state => {
  return {
    user: state.user,
  };
};

export default connect(mapStateToProps)(Message);