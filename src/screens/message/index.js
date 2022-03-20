import { Text, View } from 'react-native'
import React, { Component } from 'react'

export default class Index extends Component {
  render() {
    return (
      <View>
        <Text>index</Text>
      </View>
    )
  }
}

// import React, {Component} from 'react';
// import {
//   Text,
//   StyleSheet,
//   View,
//   TouchableOpacity,
//   ScrollView,
// } from 'react-native';
// import {connect} from 'react-redux';
// import {IconBack} from '../../assets';
// import {CBubbleText, CGap, CImageCircle, CTextInput} from '../../components';
// import {colors, fonts, responsiveWidth} from '../../utils';
// import firestore from '@react-native-firebase/firestore';
// import {convertDate} from '../../utils/util/date';

// class OnChat extends Component {
//   constructor(props) {
//     super(props);

//     this.state = {
//       target: this.props.route.params,
//       messages: [],
//       inputText: '',
//     };
//   }

//   componentDidMount() {
//     const {dataUser} = this.props;
//     const {target, messages} = this.state;
//     firestore()
//       .collection('messages')
//       .doc(dataUser.uid)
//       .collection('chatWith')
//       .doc(target.uid)
//       .onSnapshot(res => {
//         this.setState({messages: res.data()?.messages});
//       });
//   }

//   _send = () => {
//     const {dataUser} = this.props;
//     const {target, inputText} = this.state;
//     firestore()
//       .collection('messages')
//       .doc(dataUser.uid)
//       .collection('chatWith')
//       .doc(target.uid)
//       .set(
//         {
//           messages: firestore.FieldValue.arrayUnion({
//             text: inputText,
//             sendBy: dataUser.uid,
//             date: new Date(),
//           }),
//           lastChat: {
//             uid: target.uid,
//             text: inputText,
//             image: target.image ? target.image : '',
//             date: new Date(),
//             name: target.name,
//           },
//         },
//         {merge: true},
//       )
//       .then(() => {
//         this.setState({inputText: ''});
//       });

//     firestore()
//       .collection('messages')
//       .doc(target.uid)
//       .collection('chatWith')
//       .doc(dataUser.uid)
//       .set(
//         {
//           messages: firestore.FieldValue.arrayUnion({
//             text: inputText,
//             sendBy: dataUser.uid,
//             date: new Date(),
//           }),
//           lastChat: {
//             uid: dataUser.uid,
//             text: inputText,
//             image: dataUser.image ? dataUser.image : '',
//             date: new Date(),
//             name: dataUser.name,
//           },
//         },
//         {merge: true},
//       );
//   };

//   render() {
//     const {navigation, dataUser} = this.props;
//     const {image, name} = this.state.target;
//     const {inputText, messages} = this.state;
//     return (
//       <View style={styles.page}>
//         <View style={styles.topBar}>
//           <TouchableOpacity
//             style={{marginRight: 40}}
//             onPress={() => {
//               navigation.goBack('');
//             }}>
//             <IconBack />
//           </TouchableOpacity>
//           <CImageCircle
//             image={{uri: image}}
//             height={responsiveWidth(40)}
//             width={responsiveWidth(40)}
//           />
//           <Text style={styles.name}>{name}</Text>
//         </View>
//         <ScrollView style={{flex: 1}}>
//           {messages ? (
//             messages.map((value, index, array) => {
//               let countTime =
//                 index != 0 ? convertDate(array[index - 1].date.toDate()) : '';
//               return (
//                 <View key={index}>
//                   {countTime != convertDate(value.date.toDate()) && (
//                     <Text style={{alignSelf: 'center', marginVertical: 10}}>
//                       {convertDate(value.date.toDate())}
//                     </Text>
//                   )}
//                   <CBubbleText
//                     isMe={value.sendBy == dataUser.uid}
//                     text={value.text}
//                     time={value.date.toDate()}
//                   />
//                 </View>
//               );
//             })
//           ) : (
//             <Text style={{color: 'black'}}>Start new convertation</Text>
//           )}
//           {/* <View style={styles.leftChat}>
//             <Text>
//               Lorem ipsum dolor sit amet Lorem ipsum dolor sit amet Lorem Lorem
//               ipsum dolor sit amet Lorem ipsum dolor Lor...
//             </Text>
//             <Text>14 November 2020</Text>
//           </View>
//           <View style={styles.rightChat}>
//             <Text>
//               Lorem ipsum dolor sit amet Lorem ipsum dolor sit amet Lorem Lorem
//               ipsum dolor sit amet Lorem ipsum dolor Lor...
//             </Text>
//           </View> */}
//         </ScrollView>
//         <View
//           style={{
//             flexDirection: 'row',
//             justifyContent: 'space-between',
//             alignItems: 'center',
//           }}>
//           <CTextInput
//             width={responsiveWidth(320)}
//             borderWidth={0.2}
//             value={inputText}
//             onChangeText={inputText => {
//               this.setState({inputText});
//             }}
//           />
//           <TouchableOpacity onPress={() => this._send()}>
//             <CImageCircle
//               image={require('../../assets/images/ArrowTop.png')}
//               width={responsiveWidth(40)}
//               height={responsiveWidth(40)}
//               backgroundColor={colors.primary}
//             />
//           </TouchableOpacity>
//         </View>
//         <CGap height={15} />
//       </View>
//     );
//   }
// }

// const mapStateToProps = state => {
//   return {
//     chatData: state.chatData,
//     dataUser: state.userReducer.dataUser,
//   };
// };

// const mapDispatchToProps = send => {
//   return {
//     chatData: data =>
//       send({
//         type: 'CHAT-DATA',
//         payload: data,
//       }),
//   };
// };

// export default connect(mapStateToProps, mapDispatchToProps)(OnChat);

// const styles = StyleSheet.create({
//   page: {
//     flex: 1,
//     paddingHorizontal: 17,
//     paddingTop: 30,
//   },
//   topBar: {
//     flexDirection: 'row',
//     marginBottom: 15,
//     alignItems: 'center',
//   },
//   name: {
//     marginLeft: 15,
//     fontFamily: fonts.primary.medium,
//     fontSize: 17,
//   },
//   leftChat: {
//     maxWidth: responsiveWidth(280),
//     padding: 10,
//     backgroundColor: colors.lightYellow,
//     borderRadius: 10,
//     marginBottom: 40,
//     left: 0,
//   },
//   rightChat: {
//     maxWidth: responsiveWidth(280),
//     padding: 10,
//     backgroundColor: colors.lightBlue,
//     borderRadius: 10,
//     right: 0,
//     marginLeft: responsiveWidth(100),
//   },
// });
