import {
  Image,
  Text,
  StyleSheet,
  View,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import React, {Component} from 'react';
import auth from '@react-native-firebase/auth';
import CTextInput from '../../components/atoms/CTextInput';
import CButton from '../../components/atoms/CButton';
import {connect} from 'react-redux';

export class HomeScreen extends Component {
  async componentDidMount() {
    const update = {
      displayName: 'Muhammad Farid Zaki',
      photoURL:
        'https://www.shareicon.net/data/2016/09/01/822742_user_512x512.png',
    };

    await auth().currentUser.updateProfile(update);
    //this.props.addProfile(auth().currentUser);
    console.log(this.props.userNow);
  }
  _userLogout = () => {
    auth()
      .signOut()
      .then(() => {
        console.log('User signed out!');
        this.props.navigation.replace('OnboardScreen');
      });
  };
  render() {
    return (
      <View style={{backgroundColor: 'white', flex: 1}}>
        <View style={styles.header}>
          <View>
            <Text style={{fontSize: 25, fontWeight: 'bold', color: 'green'}}>
              TemuBarang
            </Text>
          </View>

          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Text
              onPress={() => {
                this._userLogout();
              }}
              style={{
                fontSize: 10,
                fontWeight: 'bold',
                color: 'green',
                marginRight: 5,
              }}>
              Log out
            </Text>
            <TouchableOpacity>
              <View>
                <Image
                  style={styles.circleImage}
                  source={{uri: `${auth().currentUser.photoURL}`}}
                />
              </View>
            </TouchableOpacity>
          </View>
        </View>
        <View
          style={{
            flexDirection: 'row',
            marginTop: 15,
            justifyContent: 'space-evenly',
          }}>
          <CTextInput
            placeholder="cari barang"
            style={{borderColor: 'silver',alignItems:'center',width:'80%'}}
          />
          <CButton style={{borderColor: 'silver', width: 60}} />
        </View>
        <View
          style={{
            marginTop: 25,
            flexDirection: 'row',
            justifyContent: 'space-around',
          }}>
          <TouchableOpacity style={styles.buttonMenu}></TouchableOpacity>
          <TouchableOpacity style={styles.buttonMenu}></TouchableOpacity>
          <TouchableOpacity style={styles.buttonMenu}></TouchableOpacity>
          <TouchableOpacity style={styles.buttonMenu}></TouchableOpacity>
        </View>
        <ScrollView style={{marginTop: 25}}>
          <View style={{marginBottom: 20}}>
            <Text style={{color: 'grey', marginLeft: 25}}>
              Recently Lost Items
            </Text>
            <ScrollView
              horizontal={true}
              showsHorizontalScrollIndicator={false}>
              <TouchableOpacity style={{...styles.menu}}>
                <Image
                  style={{width: 220, height: 220, borderRadius: 25}}
                  source={require('../../../src/assets/dummy.png')}
                />
              </TouchableOpacity>
              <TouchableOpacity style={{...styles.menu}}>
                <Image
                  style={{width: 220, height: 220, borderRadius: 25}}
                  source={require('../../../src/assets/dummy.png')}
                />
              </TouchableOpacity>
              <TouchableOpacity style={{...styles.menu}}>
                <Image
                  style={{width: 220, height: 220, borderRadius: 25}}
                  source={require('../../../src/assets/dummy.png')}
                />
              </TouchableOpacity>
            </ScrollView>
          </View>
          <View style={{marginBottom: 20}}>
            <Text style={{color: 'grey', marginLeft: 25}}>
              Recently Found Items
            </Text>
            <ScrollView
              horizontal={true}
              showsHorizontalScrollIndicator={false}>
              <TouchableOpacity style={{...styles.menu}}>
                <Image
                  style={{width: 220, height: 220, borderRadius: 25}}
                  source={require('../../../src/assets/dummy.png')}
                />
              </TouchableOpacity>
              <TouchableOpacity style={{...styles.menu}}>
                <Image
                  style={{width: 220, height: 220, borderRadius: 25}}
                  source={require('../../../src/assets/dummy.png')}
                />
              </TouchableOpacity>
              <TouchableOpacity style={{...styles.menu}}>
                <Image
                  style={{width: 220, height: 220, borderRadius: 25}}
                  source={require('../../../src/assets/dummy.png')}
                />
              </TouchableOpacity>
            </ScrollView>
          </View>
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderColor: 'silver',
  },
  menu: {
    marginHorizontal: 10,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardText: {
    fontStyle: 'italic',
    fontWeight: 'bold',
    fontSize: 20,
  },
  circleImage: {
    width: 50,
    height: 50,
    borderRadius: 150 / 2,
    borderWidth: 1,
    borderColor: 'green',
  },
  buttonMenu: {
    width: 60,
    height: 60,
    borderWidth: 1,
    borderColor: 'silver',
    borderRadius: 10,
  },
});
const mapStateToProps = state => {
  return {
    userNow: state.userNow,
  };
};
const mapDispatchToProps = dispatch => {
  return {
    addProfile: data => {
      dispatch({
        type: 'ADD-PROFILE',
        payload: data,
      });
    },
    deleteProfile: data => {
      dispatch({
        type: 'DELETE-PROFILE',
        payload: data,
      });
    },
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(HomeScreen);
