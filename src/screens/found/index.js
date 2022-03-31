import {
  Image,
  Text,
  StyleSheet,
  View,
  TextInput,
  RefreshControl,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import React, {Component} from 'react';
import auth from '@react-native-firebase/auth';
import CTextInput from '../../components/atoms/CTextInput';
import CButton from '../../components/atoms/CButton';
import {connect} from 'react-redux';
import firestore from '@react-native-firebase/firestore';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
export default class FoundScreen extends Component {
  constructor() {
    super();
    this.state = {
      searchData: '',
      dataFire: [],
      renderData: [],
      refreshing: false,
      modalVisible: false,
    };
    let cari;
    let mounted;
  }
  async componentDidMount() {
    this.mounted = true;
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
          this.mounted == true && this.setState({dataFire: sorted});
        }
      });
  }
  // _barangSearch = () => {
  //   let {cari} = this;
  //   const {dataFire, renderData, searchData} = this.state;
  //   cari = dataFire.filter(x => {if(x)if(x.namabarang){
  //     return x.namabarang == searchData;}
  //   });
  //   if (cari.length > 0) {
  //     this.mounted == true && this.setState({renderData: cari});
  //     alert('barang ditemukan');
  //   }
  //   if (!searchData) {
  //     this.mounted == true && this.setState({renderData: dataFire});
  //   }
  //   if (cari.length < 1 && searchData) {
  //     alert('barang tidak ditemukan');
  //     this.mounted == true && this.setState({renderData: dataFire});
  //   }
  // };
  _setModalVisible = visible => {
    this.setState({modalVisible: visible});
  };
  _barangSearch = text => {
    const {dataFire} = this.state;
    if (text) {
      const newData = dataFire.filter(item => {
        const itemData = item.namabarang
          ? item.namabarang.toUpperCase()
          : ''.toUpperCase();
        const textData = text.toUpperCase();
        return itemData.indexOf(textData) > -1;
      });
      this.setState({renderData: newData});
    } else {
      this.setState({renderData: null});
    }
  };
  _barangSearchkategori = text => {
    const {dataFire} = this.state;
    if (text) {
      const newData = dataFire.filter(item => {
        const itemData = item.kategori
          ? item.kategori.toUpperCase()
          : ''.toUpperCase();
        const textData = text.toUpperCase();
        return itemData.indexOf(textData) > -1;
      });
      this.setState({renderData: newData});
    } else {
      this.setState({renderData: null});
    }
  };
  componentWillUnmount() {
    this.mounted = false;
  }
  _wait = timeout => {
    return new Promise(resolve => setTimeout(resolve, timeout));
  };
  _userLogout = () => {
    auth()
      .signOut()
      .then(() => {
        console.log('User signed out!');
        this.props.navigation.replace('OnboardScreen');
      });
  };
  _onRefresh = () => {
    this.mounted == true && this.setState({refreshing: true});
    this._wait(1000).then(() => {
      this.mounted == true &&
        this.setState({
          dataFire: this.state.dataFire,
          renderData: this.cari,
          refreshing: false,
        });
    });
  };
  render() {
    const {dataFire, renderData, searchData, refreshing, modalVisible} =
      this.state;
    return (
      <View style={{backgroundColor: 'white', flex: 1}}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => this.props.navigation.navigate('TabNav')}
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Ionicons name="arrow-back" size={25} color="green" />
            <Text
              style={{
                fontSize: 25,
                fontWeight: 'bold',
                color: 'green',
                marginLeft: 5,
              }}>
              TemuBarang
            </Text>
          </TouchableOpacity>

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
          <TextInput
            placeholderTextColor={'silver'}
            placeholder="cari barang"
            textAlign={'center'}
            style={{
              borderColor: 'silver',
              borderWidth: 1,
              width: '80%',
              alignItems: 'center',
              color: 'black',
            }}
            value={searchData}
            onChangeText={value => {
              this._barangSearch(value);
              this.setState({searchData: value});
            }}
          />
          
          <Ionicons name="options" size={40} color="silver" onPress={() => {
              this._setModalVisible(!modalVisible);
            }}/>
        </View>

        <ScrollView
          style={{
            marginTop: 10,
            backgroundColor: 'green',
            borderTopLeftRadius: 15,
            borderTopRightRadius: 15,
          }}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={this._onRefresh}
            />
          }>
          <Text
            style={{
              color: 'black',
              marginTop: 5,
              alignSelf: 'center',
              fontSize: 16,
            }}>
            Found Items
          </Text>
          <View style={{marginBottom: 10}}></View>
          <View style={styles.itemMenu}>
            {this.mounted == true && renderData && renderData.length > 0
              ? renderData.map((x, i) => {
                  return (
                    x && (
                      <TouchableOpacity
                        onPress={() =>
                          this.props.navigation.navigate('DetailsScreen', x)
                        }
                        key={i}
                        style={{...styles.item, borderWidth: 5}}>
                        <View>
                          <View>
                            <Image
                              source={
                                x.photoURL
                                  ? {uri: `${x.photoURL}`}
                                  : require('../../assets/galeryImages.jpeg')
                              }
                              style={{
                                width: '100%',
                                height: 200,
                                borderTopLeftRadius: 15,
                                borderTopRightRadius: 15,
                              }}
                            />
                          </View>
                          <View style={{flexShrink: 1, margin: 5}}>
                            <Text style={{color: 'black', fontSize: 16}}>
                              {x.namabarang}
                            </Text>
                            <Text style={{color: 'black', fontSize: 14}}>
                              {x.kategori}
                            </Text>
                            <Text style={{color: 'black'}}>
                              Hadiah : {x.hadiah}
                            </Text>
                            <Text style={{color: 'grey', marginTop: 5}}>
                              <EvilIcons name="location" size={16} />
                              {x.lokasi}
                            </Text>
                          </View>
                        </View>
                      </TouchableOpacity>
                    )
                  );
                })
              : dataFire.map((x, i) => {
                  return (
                    x && (
                      <TouchableOpacity
                        onPress={() =>
                          this.props.navigation.navigate('DetailsScreen', x)
                        }
                        key={i}
                        style={{...styles.item, borderWidth: 5}}>
                        <View>
                          <View>
                            <Image
                              source={
                                x.photoURL
                                  ? {uri: `${x.photoURL}`}
                                  : require('../../assets/galeryImages.jpeg')
                              }
                              style={{
                                width: '100%',
                                height: 200,
                                borderTopLeftRadius: 15,
                                borderTopRightRadius: 15,
                              }}
                            />
                          </View>
                          <View style={{flexShrink: 1, margin: 5}}>
                            <Text style={{color: 'black', fontSize: 16}}>
                              {x.namabarang}
                            </Text>
                            <Text style={{color: 'black', fontSize: 14}}>
                              {x.kategori}
                            </Text>
                            {/* <Text style={{color: 'black'}}>
                              Hadiah : {x.hadiah}
                            </Text> */}
                            <Text style={{color: 'grey', marginTop: 10}}>
                              <EvilIcons name="location" size={16} />
                              {x.lokasi}
                            </Text>
                          </View>
                        </View>
                      </TouchableOpacity>
                    )
                  );
                })}
          </View>
        </ScrollView>
        {modalVisible && (
          <View
            style={{
              backgroundColor: 'white',
              position: 'absolute',
              top: 150,
              right: 10,
              borderWidth: 1,
              borderColor: 'black',
            }}>
            {dataFire.map((value, index) => {
              if (value.kategori) {
                return (
                  <View key={index}>
                    <Text
                      onPress={() => {
                        this._barangSearchkategori(value.kategori);
                        this._setModalVisible(false);
                      }}
                      style={{color: 'silver'}}>
                      {value.kategori}
                    </Text>
                  </View>
                );
              }
            })}
          </View>
        )}
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
    borderRadius: 15,
    marginBottom: 5,
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
  itemMenu: {
    flex: 1,
    // margin: 5,
    flexDirection: 'row',
    flexWrap: 'wrap',
    // justifyContent: 'center',
    alignContent: 'space-between',
  },
  item: {
    width: '50%',
    // justifyContent: 'center',
    // alignItems: 'center',
    // marginBottom: 0,
    backgroundColor: 'white',
    borderColor: 'green',
    borderRadius: 20,
  },
});
