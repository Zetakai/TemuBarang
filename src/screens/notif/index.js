import {
  Text,
  StyleSheet,
  View,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert,
  RefreshControl,
} from 'react-native';
import React, {Component} from 'react';
import AntDesign from 'react-native-vector-icons/AntDesign';
import messaging from '@react-native-firebase/messaging';
import {convertDateTime, timeSince} from '../../components/utils/moment';
import {connect} from 'react-redux';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

export class NotifScreen extends Component {
  constructor() {
    super();
    this.state = {
      data: [],
      dataFire: [],
      refreshing: false,
    };
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  componentDidMount() {
    this.mounted = true;
    this._retrieveData();
  }

  _retrieveData = async () => {
    const {user} = this.props;
    this.mounted = true;
    await firestore()
      .collection('Notifications')
      .doc(user.uid)
      .onSnapshot(x => {
        if (x) {
          if (x.data() != null) {
            let cup = x.data().notifs;
            if (cup) {
              let sorted = cup.flat().sort((a, b) => b.sentTime - a.sentTime);
              this.mounted == true && this.setState({dataFire: sorted});
              console.log(cup);
            }
          }
        }
      });
  };

  _checkToken = async () => {
    const fcmToken = await messaging().getToken();
    if (fcmToken) {
      console.log(fcmToken);
    }
  };

  _deleteInbox = () => {
    Alert.alert(
      'Hapus semua?',
      'Setelah Anda menghapus semua notifikasi, Anda tidak dapat membatalkannya.',
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
    const {refreshing} = this.state;
    const {user}=this.props
    firestore()
      .collection('Notifications')
      .doc(user.uid)
      .update({notifs: []})
      .then(() => {
        console.log('Deleted!');
      });
    // this.setState({refreshing: !refreshing})
  };

  _onRefresh = () => {
    // this.mounted == true && this.setState({refreshing: true});
    // this._wait(10).then(() => {
    //   this.mounted == true &&
    //     this._retrieveData();
    // });
    this._retrieveData();
  };

  _wait = timeout => {
    return new Promise(resolve => setTimeout(resolve, timeout));
  };

  render() {
    const {dataFire, refreshing} = this.state;
    const {navigation} = this.props;
    console.log(dataFire);

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

        <ScrollView
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={this._onRefresh}
            />
          }>
          {dataFire.length > 0 ? (
            dataFire.map((value, index) => {
              return (
                <TouchableOpacity
                  key={index}
                  onPress={() =>
                    navigation.navigate('NotifDetailsScreen', value)
                  }
                  style={styles.inboxCard}>
                  <View>
                    <Text style={styles.inboxTitle}>{value.title}</Text>
                    <Text style={styles.inboxBody}>
                      {value.body.substr(0, 100)}
                    </Text>
                    <Text style={styles.inboxDate}>
                      {timeSince(value.sentTime)}yang lalu
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
    notif: state.notif,
    user: state.user,
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

export default connect(mapStateToProps, mapDispatchToProps)(NotifScreen);

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
    color: 'black',
    fontSize: 13,
    paddingTop: 30,
  },
});
