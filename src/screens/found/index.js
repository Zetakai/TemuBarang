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
export default class FoundScreen extends Component {
  constructor() {
    super();
    this.state = {
      searchData: '',
      dataFire: [],
      renderData: [],
      refreshing: false,
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
      this.setState({renderData: newData, searchData: ""});
      
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
    const {dataFire, renderData, searchData, refreshing} = this.state;
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
            onChangeText={value => this.setState({searchData: value})}
          />
          <CButton
            style={{borderColor: 'silver', width: 60}}
            onPress={() => {
              this._barangSearch(searchData);
            }}
          />
        </View>

        <ScrollView
          style={{marginTop: 25}}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={this._onRefresh}
            />
          }>
          <View style={{marginBottom: 10}}>
            <Text style={{color: 'grey', marginLeft: 25}}>
              Recently Found Items
            </Text>
          </View>
          <View>
            {this.mounted == true && renderData && renderData.length > 0
              ? renderData.map((x, i) => {
                  return (
                    x && (
                      <TouchableOpacity
                        onPress={() =>
                          this.props.navigation.navigate('DetailsScreen', x)
                        }
                        key={i}
                        style={{...styles.menu, borderWidth: 1}}>
                        <View
                          style={{
                            marginBottom: 10,
                            alignItems: 'stretch',
                            flexDirection: 'row',
                          }}>
                          <View>
                            <Image
                              source={
                                x.photoURL
                                  ? {uri: `${x.photoURL}`}
                                  : require('../../assets/galeryImages.jpeg')
                              }
                              style={{
                                width: 100,
                                height: 100,
                                borderRadius: 25,
                              }}
                            />
                          </View>
                          <View style={{flexShrink: 1}}>
                            <Text style={{color: 'black'}}>
                              Nama Barang: {x.namabarang}
                            </Text>
                            <Text style={{color: 'black'}}>
                              Kategori Barang : {x.kategori}
                            </Text>
                            <Text style={{color: 'black'}}>
                              Lokasi ditemukan :{x.lokasi}
                            </Text>
                          </View>
                        </View>
                        <View>
                          <Text style={{color: 'black'}}>
                            Hadiah baagi yang menemukan: {x.hadiah}
                          </Text>
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
                        style={{...styles.menu, borderWidth: 1}}>
                        <View
                          style={{
                            marginBottom: 10,
                            alignItems: 'stretch',
                            flexDirection: 'row',
                          }}>
                          <View>
                            <Image
                              source={
                                x.photoURL
                                  ? {uri: `${x.photoURL}`}
                                  : require('../../assets/galeryImages.jpeg')
                              }
                              style={{
                                width: 100,
                                height: 100,
                                borderRadius: 25,
                              }}
                            />
                          </View>
                          <View style={{flexShrink: 1}}>
                            <Text style={{color: 'black'}}>
                              Nama Barang: {x.namabarang}
                            </Text>
                            <Text style={{color: 'black'}}>
                              Kategori Barang : {x.kategori}
                            </Text>
                            <Text style={{color: 'black'}}>
                              Lokasi ditemukan :{x.lokasi}
                            </Text>
                          </View>
                        </View>
                        <View>
                          <Text style={{color: 'black'}}>
                            Hadiah baagi yang menemukan: {x.hadiah}
                          </Text>
                        </View>
                      </TouchableOpacity>
                    )
                  );
                })}
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
});
