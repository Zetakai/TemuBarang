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
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import {colors, fonts, responsiveWidth} from '../../components/utils/Utility';
import {timeSince} from '../../components/utils/moment';
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
    console.log(auth().currentUser);
    this.mounted = true;
    //this.props.addProfile(auth().currentUser);
    await firestore()
      .collection('Lost')
      .onSnapshot(x => {
        if (x != null) {
          let user = x.docs.map(y => {
            return y.data();
          });
          let cup = user.map(x => {
            return x.posts;
          });
          let sorted = cup.flat().sort((a, b) => b.time - a.time);
          this.mounted == true && this.setState({dataLost: sorted.slice(0, 3)});
        }
      });
    await firestore()
      .collection('Found')
      .onSnapshot(x => {
        if (x != null) {
          let user = x.docs.map(y => {
            return y.data();
          });
          let cup = user.map(x => {
            return x.posts;
          });
          let sorted = cup.flat().sort((a, b) => b.time - a.time);
          this.mounted == true &&
            this.setState({dataFound: sorted.slice(0, 3)});
        }
      });
    this.props.update();
  }

  componentWillUnmount() {
    this.mounted = false;
  }

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
    const {user} = this.props;
    const {dataLost, dataFound, refreshing} = this.state;
    return (
      <View style={{backgroundColor: '#e5e5e5', flex: 1}}>
        <View style={styles.header}>
          {/* <View>
            <Image
              source={require('../../assets/test-01-01.png')}
              style={{width: 25, height: 25}}
            />
            </View> */}
          <View>
            <Text style={{fontSize: 25, fontWeight: 'bold', color: '#00ca74'}}>
              TemuBarang
            </Text>
          </View>
        </View>
        <ScrollView
          style={{marginTop: 0}}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={this._onRefresh}
            />
          }>
        <View style={styles.expProfile}>
          {/* <Text style={{marginLeft: 15, fontSize: 25, color: 'white'}}>
            Hello,
          </Text>
          <Text style={{marginLeft: 15, fontSize: 18, color: 'white'}}>
            {user.displayName}
          </Text> */}
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              marginVertical: 20,
            }}>
            <TouchableOpacity
              style={{
                width: '45%',
                height: 150,
                backgroundColor: 'white',
                borderRadius: 5,
                justifyContent: 'center',
                alignItems: 'center',
              }}
              onPress={() => {
                this.props.navigation.navigate('LostScreen');
              }}>
              <View>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <Image
                    style={{
                      width: 50,
                      height: 50,
                      borderRadius: 150 / 2,
                      borderWidth: 1,
                      borderColor: 'black',marginRight:15
                    }}
                    source={{
                      uri: `https://cdn-icons-png.flaticon.com/512/1201/1201867.png?w=740&t=st=1648131697~exp=1648132297~hmac=d6bfe1e0bc84ce6f6d951f667c23e8bad006e6603955034d481ec6eedcb5f1e4`,
                    }}
                  />
                  <Text style={{color: 'black', fontSize: 16}}>Barang{'\n'}Hilang</Text>
                </View>
                <Text style={{color: 'silver', marginTop: 10}}>
                  Daftar barang hilang yang dicari
                </Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                marginLeft: 10,
                width: '45%',
                height: 150,
                backgroundColor: 'white',
                borderRadius: 5,
                justifyContent: 'center',
                alignItems: 'center',
              }}
              onPress={() => {
                this.props.navigation.navigate('FoundScreen');
              }}>
              <View>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <Image
                    style={{
                      width: 50,
                      height: 50,
                      borderRadius: 150 / 2,
                      borderWidth: 1,
                      borderColor: 'black',marginRight:15
                    }}
                    source={{
                      uri: `https://cdn4.iconfinder.com/data/icons/search-blue-line/64/168_search-magnifier-find-item-cargo-1024.png`,
                    }}
                  />
                  <Text style={{color: 'black', fontSize: 16}}>Barang{'\n'}Temuan</Text>
                </View>
                <Text style={{color: 'silver', marginTop: 10}}>
                  Daftar barang hilang yang ditemukan
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
        
          
          <View
            style={{
              backgroundColor: 'white',
              padding: 5,marginTop: 5,
            }}>
            <Text
              style={{
                color: 'black',
                marginLeft: 10,
                marginBottom: 5,
                marginTop: 10,
              }}>
              Barang Hilang Terbaru
            </Text>
            <View>
              {dataLost.map((x, i) => {
                return (
                  x && (
                    <TouchableOpacity
                      key={i}
                      style={{...styles.menu, backgroundColor: '#00ca74'}}
                      onPress={() =>
                        this.props.navigation.navigate('DetailsScreen', x)
                      }>
                      <View style={{flexDirection: 'row'}}>
                        <Image
                          source={
                            x.photoURL
                              ? {uri: `${x.photoURL}`}
                              : require('../../assets/galeryImages.jpeg')
                          }
                          style={{
                            width: 75,
                            height: 75,
                            borderTopLeftRadius: 10,
                            borderBottomLeftRadius: 10,
                          }}
                        />
                      </View>
                      <View
                        style={{
                          flex:1 ,
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          marginLeft: 10,
                          flexDirection: 'row',
                        }}>
                        <View>
                          <Text
                            style={{
                              color: 'black',
                            }}>
                            {x.namabarang}
                          </Text>
                          <Text
                            style={{
                              color: 'black',
                              fontStyle: 'italic',
                              fontWeight: 'bold',
                              marginTop: 5,
                            }}>
                            <EvilIcons name="location" size={16} />
                            {x.lokasi}
                          </Text>
                        </View>
                        <View style={{marginRight: 10}}>
                          <Text style={{textAlign: 'right'}}>{timeSince(x.time.seconds)}lalu</Text>
                        </View>
                      </View>
                    </TouchableOpacity>
                  )
                );
              })}
            </View>
          </View>
          <View
            style={{
              marginBottom: 5,
              backgroundColor: 'white',
              marginTop: 5,
              padding: 10,
            }}>
            <Text style={{color: 'black', marginBottom: 5, marginLeft: 10}}>
              Barang Temuan Terbaru
            </Text>
            <View>
              {dataFound.map((x, i) => {
                return (
                  x && (
                    <TouchableOpacity
                      key={i}
                      style={{...styles.menu, backgroundColor: '#00ca74'}}
                      onPress={() =>
                        this.props.navigation.navigate('DetailsScreen', x)
                      }>
                      <View style={{flexDirection: 'row'}}>
                        <Image
                          source={
                            x.photoURL
                              ? {uri: `${x.photoURL}`}
                              : require('../../assets/galeryImages.jpeg')
                          }
                          style={{
                            width: 75,
                            height: 75,
                            borderTopLeftRadius: 10,
                            borderBottomLeftRadius: 10,
                          }}
                        />
                      </View>
                      <View
                        style={{
                          flex:1 ,
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          marginLeft: 10,
                          flexDirection: 'row',
                        }}>
                        <View>
                          <Text
                            style={{
                              color: 'black',
                            }}>
                            {x.namabarang}
                          </Text>
                          <Text
                            style={{
                              color: 'black',
                              fontStyle: 'italic',
                              fontWeight: 'bold',
                              marginTop: 5,
                            }}>
                            <EvilIcons name="location" size={16} />
                            {x.lokasi}
                          </Text>
                        </View>
                        <View style={{marginRight: 10}}>
                          <Text style={{textAlign: 'right'}}>{timeSince(x.time.seconds)}lalu</Text>
                        </View>
                      </View>
                    </TouchableOpacity>
                  )
                );
              })}
            </View>
          </View>
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: 'white',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderColor: 'silver',
  },
  menu: {
    marginLeft: 10,
    marginRight: 15,
    borderRadius: 10,
    width: '96%',
    height: 75,
    flexDirection: 'row',
    marginBottom: 10,
    shadowColor: 'black',
    shadowOffset: {width: 10, height: 10},
    shadowOpacity: 0.7,
    shadowRadius: 5,
    elevation: 7,
  },
  cardText: {
    fontStyle: 'italic',
    fontWeight: 'bold',
    fontSize: 20,
  },
  expProfile: {
    backgroundColor: '#00ca74',
    marginTop: 5,
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
  element: {
    backgroundColor: colors.black,
    color: colors.redmuda,
    fontFamily: fonts.primary.Entypo,
    borderBottomColor: colors.black,
    borderRadius: 10,
    padding: '5%',
    marginRight: 10,

    flexDirection: 'row',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.32,
    shadowRadius: 5.46,

    elevation: 25,
  },
});

const mapStateToProps = state => {
  return {
    user: state.user,
  };
};
const mapDispatchToProps = dispatch => {
  return {
    logout: data => {
      dispatch({
        type: 'LOGOUT-USER',
        payload: data,
      });
    },
    update: data => {
      dispatch({
        type: 'UPDATE-USER',
        payload: data,
      });
    },
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(HomeScreen);
