import {
  Image,
  Text,
  StyleSheet,
  View,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
} from 'react-native';
import React, {Component} from 'react';
import auth from '@react-native-firebase/auth';
import CTextInput from '../../components/atoms/CTextInput';
import CButton from '../../components/atoms/CButton';
import {connect} from 'react-redux';
import firestore from '@react-native-firebase/firestore';
export class HomeScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataLost: [],
      dataFound: [],
      expandProfile: false,
      refreshing: false,
    };
    let mounted;
  }
  async componentDidMount() {
    this.mounted = true;
    //this.props.addProfile(auth().currentUser);
    await firestore()
      .collection('Lost')
      .onSnapshot(x => {
        let user = x.docs.map(y => {
          return y.data();
        });
        let cup = user.map(x => {
          return x.posts;
        });
        let sorted= cup.flat().sort((a, b) => b.time - a.time)
        this.mounted == true &&
          this.setState({dataLost: sorted.slice(0, 3)});
      });
    await firestore()
      .collection('Found')
      .onSnapshot(x => {
        let user = x.docs.map(y => {
          return y.data();
        });
        let cup = user.map(x => {
          return x.posts;
        });
        let sorted= cup.flat().sort((a, b) => b.time - a.time)
        this.mounted == true &&
          this.setState({dataFound: sorted.slice(0, 3)});
      });
  }
  componentWillUnmount(){this.mounted=false}
  _userLogout = () => {
    auth()
      .signOut()
      .then(() => {
        console.log('User signed out!');
        this.props.navigation.replace('OnboardScreen');
      });
  };
  _wait = timeout => {
    return new Promise(resolve => setTimeout(resolve, timeout));
  };
  _onRefresh = () => {
    this.mounted == true && this.setState({refreshing: true});
    this._wait(1000).then(() => {
      this.mounted == true &&
        this.setState({
          dataLost: this.state.dataLost,
          dataFound: this.state.dataFound,
          refreshing: false,
        });
    });
  };
  render() {
    const {dataLost, dataFound, expandProfile, refreshing} = this.state;
    return (
      <View style={{backgroundColor: 'white', flex: 1}}>
        <TouchableOpacity
          onPress={() => this.setState({expandProfile: !expandProfile})}>
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
        </TouchableOpacity>
        {expandProfile == true ? (
          <View style={styles.expProfile}>
            <Image
              style={styles.avatar}
              source={{
                uri: 'https://www.shareicon.net/data/2016/09/01/822742_user_512x512.png',
              }}
            />
            <Text style={{alignSelf: 'center', paddingLeft: 10}}>
              {auth().currentUser.displayName}
            </Text>
          </View>
        ) : null}

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
          <TouchableOpacity
            style={styles.buttonMenu}
            onPress={() => {
              this.props.navigation.navigate('LostScreen');
            }}>
            <Text style={{color: 'black'}}>Lost</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.buttonMenu}
            onPress={() => {
              this.props.navigation.navigate('FoundScreen');
            }}>
            <Text style={{color: 'black'}}>Found</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.buttonMenu}></TouchableOpacity>
          <TouchableOpacity style={styles.buttonMenu}></TouchableOpacity>
        </View>
        <ScrollView
          style={{marginTop: 25}}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={this._onRefresh}
            />
          }>
          <View style={{marginBottom: 20}}>
            <Text style={{color: 'grey', marginLeft: 25}}>
              Recently Lost Items
            </Text>
            <ScrollView
              horizontal={true}
              showsHorizontalScrollIndicator={false}>
              {dataLost.map((x, i) => {
                return (
                  <TouchableOpacity key={i} style={{...styles.menu}} onPress={() => this.props.navigation.navigate('DetailsScreen', x)}>
                    <Image
                     source={x.photoURL?{uri: `${x.photoURL}`}:require('../../assets/galeryImages.jpeg')}
                      style={{width: 220, height: 220, borderRadius: 25}}
                    />
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
          <View style={{marginBottom: 20}}>
            <Text style={{color: 'grey', marginLeft: 25}}>
              Recently Found Items
            </Text>
            <ScrollView
              horizontal={true}
              showsHorizontalScrollIndicator={false}>
              {dataFound.map((x, i) => {
                return (
                  <TouchableOpacity key={i} style={{...styles.menu}} onPress={() => this.props.navigation.navigate('DetailsScreen', x)}>
                    <Image
                      source={x.photoURL?{uri: `${x.photoURL}`}:require('../../assets/galeryImages.jpeg')}
                      style={{width: 220, height: 220, borderRadius: 25}}
                    />
                  </TouchableOpacity>
                );
              })}
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
  expProfile: {
    backgroundColor: 'green',
    flexDirection: 'row',
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 63,
    borderWidth: 3,
    borderColor: 'white',
    margin: 10,
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
    justifyContent: 'center',
    alignItems: 'center',
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
