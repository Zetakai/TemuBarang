

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
import CImageCircle from '../../components/CImageCircle';
import { colors,fonts,responsiveWidth } from '../../Utility';
import { convertDateTime } from '../../components/utils/moment';
import CGap from '../../components/CGap'
import { convertDate} from '../../Utility/util/date';
import CBubbleText from '../../components/CBubbleText';

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
      .onSnapshot(res => {if(res)if(res.data())
        this.setState({messages: res.data()?.messages});
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
  componentWillUnmount() {
    this.mounted = true;}

  render() {
    const {navigation, dataUse,route,data,uid,user} = this.props;
    const {params} = this.props.route;
    // const {data,uid}=navigation.route.params
    console.log(params)
    // const {image, name} = this.state.params;
    const {inputText, messages} = this.state;
    // return (
    //   <View style={styles.page}>
    //     <View style={styles.topBar}>
    //       <TouchableOpacity
    //         style={{marginRight: 40}}
    //         onPress={() => {
    //           navigation.goBack();
    //         }}>
    //        <IconBack/> 
    //       </TouchableOpacity>

         
    //       <Text style={styles.name}> {params.displayName}</Text>
          
    //     </View>
    //     <ScrollView style={{flex: 1}}>
    //     {messages && (
    //       messages.map((value, index) => {console.log(value);
    //         return (
    //           <TouchableOpacity  key={index}style={{borderColor:'black',borderWidth:1}}>
    //             <Text style={{color:'black'}}>{value.sendBy==user.uid}</Text>
    //             <Text style={{color:'black'}}>{value.text}</Text>
    //             <Text style={{color:'black'}}>{convertDateTime(new Date(value.time.seconds*1000))}</Text>
              
    //           </TouchableOpacity>
    //         );
    //       })
    //     )}
    //       {/* <View style={styles.leftChat}>
    //         <Text>
    //           Lorem ipsum dolor sit amet Lorem ipsum dolor sit amet Lorem Lorem
    //           ipsum dolor sit amet Lorem ipsum dolor Lor...
    //         </Text>
    //         <Text>14 November 2020</Text>
    //       </View>
    //       <View style={styles.rightChat}>
    //         <Text>
    //           Lorem ipsum dolor sit amet Lorem ipsum dolor sit amet Lorem Lorem
    //           ipsum dolor sit amet Lorem ipsum dolor Lor...
    //         </Text>
    //       </View> */}
    //     </ScrollView>
    //     <View
    //       style={{
    //         flexDirection: 'row',
    //         justifyContent: 'space-between',
    //         alignItems: 'center',
    //       }}>
    //       <CTextInput
            
    //         value={inputText}
    //         onChangeText={inputText => {
    //           this.setState({inputText});
    //         }}
    //       />
    //        <CButton onPress={() => this._send()}/>
    //       <TouchableOpacity >
          
    //       </TouchableOpacity>
    //     </View>
        
    //   </View>
    // );

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
        </View>
        <ScrollView style={{flex: 1}}>
          {messages ? (
            messages.map((value, index, array) => {
              
              return (
                <View key={index}>
                  
                  
                  <CBubbleText
                    isMe={value.sendBy == user.uid}
                    text={value.text}
                    
                  />
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