

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


export default class extends Component {
  constructor(props) {
    super(props);

    this.state = {
      target: this.props.route.params,
      messages: [],
      inputText: '',
    };
  }

  componentDidMount() {
    // const {dataUser} = this.props;
    // const {target, messages} = this.state;
    // firestore()
    //   .collection('messages')
    //   .doc(dataUser.uid)
    //   .collection('chatWith')
    //   .doc(target.uid)
    //   .onSnapshot(res => {
    //     this.setState({messages: res.data()?.messages});
    //   });
  }

  _send = () => {
    const {dataUser} = this.props;
    const {target, inputText} = this.state;
    firestore()
      .collection('messages')
      .doc(dataUser.uid)
      .collection('chatWith')
      .doc(target.uid)
      .set(
        {
          messages: firestore.FieldValue.arrayUnion({
            text: inputText,
            sendBy: dataUser.uid,
            date: new Date(),
          }),
          lastChat: {
            uid: target.uid,
            text: inputText,
            image: target.image ? target.image : '',
            date: new Date(),
            name: target.name,
          },
        },
        {merge: true},
      )
      .then(() => {
        this.setState({inputText: ''});
      });

    firestore()
      .collection('messages')
      .doc(target.uid)
      .collection('chatWith')
      .doc(dataUser.uid)
      .set(
        {
          messages: firestore.FieldValue.arrayUnion({
            text: inputText,
            sendBy: dataUser.uid,
            date: new Date(),
          }),
          lastChat: {
            uid: dataUser.uid,
            text: inputText,
            image: dataUser.image ? dataUser.image : '',
            date: new Date(),
            name: dataUser.name,
          },
        },
        {merge: true},
      );
  };

  render() {
    const {navigation, dataUse,route,data,uid} = this.props;
    // const {data,uid}=navigation.route.params
    console.log(route.params)
    // const {image, name} = this.state.target;
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

         
          <Text style={styles.name}> {uid}</Text>
          
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
           <CButton />
          <TouchableOpacity onPress={() => this._send()}>
          
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
