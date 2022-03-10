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
import firestore from '@react-native-firebase/firestore';
export class HomeScreen extends Component {
  constructor() {
    super();
    this.state = {dataFire: []};
  }
  async componentDidMount() {
   
    //this.props.addProfile(auth().currentUser);
    console.log(this.props.userNow);
    await firestore()
      .collection('Users')
      .onSnapshot(x => {
        let user = x.docs.map(y => {
          return y.data();
        });
        let cup = user.map(x => {
          return x.posts;
        });
        this.setState({dataFire: cup.flat().slice(0,2)});
      });
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
    const {dataFire} = this.state;
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
            <TouchableOpacity
              onPress={() => this.props.navigation.navigate('ProfileScreen')}>
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
            style={{borderColor: 'silver', alignItems: 'center', width: '80%'}}
          />
          <CButton style={{borderColor: 'silver', width: 60}} />
        </View>
        <View
          style={{
            marginTop: 25,
            flexDirection: 'row',
            justifyContent: 'space-around',
          }}>
          <TouchableOpacity style={styles.buttonMenu}><Text style={{color:'black'}}>Lost</Text></TouchableOpacity>
          <TouchableOpacity style={styles.buttonMenu} onPress={()=>{this.props.navigation.navigate('FoundScreen')}}><Text style={{color:'black'}}>Found</Text></TouchableOpacity>
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
              {dataFire.map((x, i) => {
                return (
                  <TouchableOpacity key={i} style={{...styles.menu}}>
                    <Image
                      source={{uri: `${x.photoURL}`}}
                      style={{width: 220, height: 220, borderRadius: 25}}
                    />
                  </TouchableOpacity>
                );
              })}
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
    justifyContent:'center',
    alignItems:'center'
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
