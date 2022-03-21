import {
    Text,
    StyleSheet,
    View,
    TouchableOpacity,
    Image,
    ScrollView,
    Alert,
  } from 'react-native';
  import React, {Component} from 'react';
  import AntDesign from 'react-native-vector-icons/AntDesign';
  import messaging from '@react-native-firebase/messaging';
  import {convertDateTime} from '../../components/utils/moment';
  import {connect} from 'react-redux';
  
  class index extends Component {
    constructor() {
      super();
      this.state = {
        data: [],
      };
    }
  
    componentDidMount() {
    //   this._checkToken();
    }
  
    _checkToken = async () => {
      const fcmToken = await messaging().getToken();
      if (fcmToken) {
         console.log(fcmToken);
      } 
     }

     _deleteInbox = () => {
      Alert.alert(
        'Hapus semua?',
        'Setelah Anda menghapus semua pesan, Anda tidak dapat membatalkannya.',
        [
          {
            text: 'HAPUS',
            onPress: () => this._delete(),
          },
          {text: 'Batal', onPress: () => console.log('Batal Pressed')},
        ],
      );
    };

     _delete = () => {
      this.props.delete();
    };
  
    render() {
      // const {inbox} = this.state;
      const {navigation, notif} = this.props;
      console.log(notif);
      return (
        <View style={{backgroundColor: 'white', flex: 1}}>
          <View style={styles.header}>
            <View>
              <Text style={{fontSize: 25, fontWeight: 'bold', color: 'black'}}>
                Notifikasi
              </Text>
            </View>
            <View>
              <TouchableOpacity onPress={() => this._deleteInbox()}>
                <AntDesign name="delete" size={30} style={{color: 'black'}} />
              </TouchableOpacity>
            </View>
          </View>
          <ScrollView>
            {notif.length > 0 ? (
              notif.map((value, index) => {
                return (
                  <TouchableOpacity
                    key={index}
                    onPress={() => navigation.navigate('NotifDetailsScreen', value)}
                    style={styles.inboxCard}>
                    <View>
                      <Text style={styles.inboxTitle}>{value.title}</Text>
                      <Text style={styles.inboxBody}>
                        {value.body.substr(0,100)}
                      </Text>
                      <Text style={styles.inboxDate}>
                      {convertDateTime(new Date(value.sentTime))}
                      </Text>
                    </View>
                    <View>
                      <AntDesign name="right" size={30} />
                    </View>
                  </TouchableOpacity>
                );
              })
            ) : (
              <View
                style={{
                  flex: 1,
                  alignItems: 'center',
                  justifyContent: 'center',
                  paddingTop: '50%',
                }}>
                <Text>Tidak ada pesan.</Text>
              </View>
            )}
          </ScrollView>
        </View>
      );
    }
  }
  
  const mapStateToProps = state => {
    return {
      notif: state.notif
    };
  };
  
  const mapDispatchToProps = dispatch => {
    return {
      delete: () => {
        dispatch({
          type: 'DELETE-NOTIF',
        });
      },
    };
  };
  
  export default connect(mapStateToProps, mapDispatchToProps)(index);
  
  const styles = StyleSheet.create({
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      borderBottomWidth: 1,
      padding: 10,
    },
    inboxCard: {
      borderBottomWidth: 1,
      flexDirection: 'row',
      alignItems: 'center',
      marginHorizontal: 20,
      paddingRight: 20,
      paddingVertical: 12,
      justifyContent: 'space-between',
      backgroundColor: 'white',
      borderBottomColor: 'grey',
    },
    inboxTitle: {
      fontSize: 19,
      fontWeight: 'bold',
      color: 'black',
    },
    inboxBody: {
      fontSize: 15,
      paddingTop: 5,
      color: 'black',
    },
    inboxDate: {
      fontSize: 13,
      paddingTop: 30,
    },
  });
  