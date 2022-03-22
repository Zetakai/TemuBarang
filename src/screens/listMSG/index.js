import React, {Component} from 'react';
import {Text, StyleSheet, View} from 'react-native';
import { connect } from 'react-redux';



import firestore from '@react-native-firebase/firestore';
import CText from '../../components/atoms/CText';

 export class Index extends Component {
  constructor(props) {
    super(props);

    this.state = {
      dataChat: [],
    };
  }

  componentDidMount() {
    const {data,user} = this.props;
    console.log('dataaaasfdsdsfdfg'.data)

    firestore()
      .collection('Lost')
      .doc(`${user.uid}`)
      .collection('chatWith')
      .onSnapshot(res => {if(res){if(res.docs){
        const data = res.docs.map(item => {console.log(item); ;
          return {messages: item.data().messages, ...item.data().lastChat};
        });
        this.setState({dataChat: data});}}
      });
  }

  render() {
    const {navigation,user} = this.props;
    
    const {dataChat} = this.state;
    console.log(dataChat)
    return (
      <View style={styles.pages}>
        <Text style={styles.text}>Messages</Text>
        {dataChat ? (
          dataChat.map((value, index) => {
            return (
              <View key={index}>
                <CText
                  name={value.name}
                  image={value.image}
                  message={value.messages[value.messages.length - 1].text}
                  onPress={() => {
                    navigation.navigate('Messaging', value);
                  }}
                />
              </View>
            );
          })
        ) : (
          <Text>No messages</Text>
        )}
      </View>
    );
  }
}

// collection message => masuk uid teacher => collection chatWith => get + mapping pake onSnapshot

// const mapStateToProps = state => {
//   return {
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

// export default connect(mapStateToProps, mapDispatchToProps)(Chat);

const styles = StyleSheet.create({
  pages: {
    flex: 1,
    paddingHorizontal: 17,
    paddingTop: 30,
    backgroundColor:'red'
  },
  text: {
   
    fontSize: 20,
    marginBottom: 20,
  },
});
const mapStateToProps = state => {
  return {
    user: state.user,
  };
};

export default connect(mapStateToProps)(Index);