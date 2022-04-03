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
import Entypo from 'react-native-vector-icons/Entypo';
export default class FoundScreen extends Component {
  constructor() {
    super();
    this.state = {
      searchData: '',
      dataFire: [],
      renderData: [],
      refreshing: false,
      modalVisible: false,
      pressedIndex: null,pressedAll:false
    };
    let cari;
    let mounted;
  }
  async componentDidMount() {
    this.mounted = true
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
      });this.setState({pressedAll: true})
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
    const {pressedAll,dataFire, renderData, searchData, refreshing, pressedIndex} =
      this.state;
    return (
      <View style={{backgroundColor: '#e5e5e5', flex: 1}}>
        <View style={styles.header}>
          <View>
            <TouchableOpacity
              onPress={() => this.props.navigation.navigate('TabNav')}
              style={{
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <View style={{marginLeft: 10}}>
                <Ionicons name="arrow-back" size={25} color="white" />
              </View>
            </TouchableOpacity>
          </View>
          <View>
            <Text
              style={{
                fontSize: 25,
                fontWeight: 'bold',
                color: 'white',
              }}>
              Barang Ditemukan
            </Text>
          </View>
          <View></View>
        </View>
        <View style={{backgroundColor: '#00ca74'}}>
          <View
            style={{
              flexDirection: 'row',
              marginTop: 5,
              marginLeft: 15,
              marginRight: 15,
              marginBottom: 5,
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: '#549670',
              borderRadius: 25,
            }}>
            <Entypo name="magnifying-glass" size={24} color="white" />
            <TextInput
              placeholderTextColor={'white'}
              placeholder="Pencarian"
              style={{
                backgroundColor: '#549670',
                width: '80%',
                color: 'white',
                borderRadius: 25,
                height: 45,
                marginLeft: 10,
              }}
              value={searchData}
              onChangeText={value => {
                this._barangSearch(value);
                this.setState({searchData: value});
              }}
            />
            {/* <Ionicons
            name="options"
            size={40}
            color="silver"
            onPress={() => {
              this._setModalVisible(!modalVisible);
            }}
          /> */}
          </View>
        </View>
        <View
          style={{
            width: '100%',
            height: 150,
            backgroundColor: '#00ca74',
            position: 'absolute',
            top: 108,
            borderBottomLeftRadius: 75,
          }}></View>

        <ScrollView
          style={{
            marginTop: 0,
            padding: 0,
            marginHorizontal: 15,
          }}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={this._onRefresh}
            />
          }>
          <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
          <TouchableOpacity
                    onPress={() => {
                      this._barangSearchkategori(null);
                      this.setState({pressedAll: true,pressedIndex:null});
                    }}
                    style={{
                      marginRight: 10,
                      marginVertical: 15,
                      borderRadius: 25,
                      height: 50,
                      flexDirection: 'row',
                      backgroundColor:
                        pressedAll != true ? '#549670' : 'white',
                      alignSelf: 'flex-start',
                      alignItems: 'center',
                    }}>
                    <Text
                      style={{
                        paddingHorizontal: 15,
                        color: pressedAll != true ? 'white' : '#549670',
                        fontSize: 14
                      }}>
                      All
                      <Text style={{color: '#e5e5e5'}}>   {dataFire.length}</Text>
                    </Text>
                  </TouchableOpacity>
            {dataFire.map((value, index) => {
              if (value.kategori) {
                return (
                  <TouchableOpacity
                    onPress={() => {
                      this._barangSearchkategori(value.kategori);
                      this.setState({pressedIndex: index,pressedAll:false});
                    }}
                    key={index}
                    style={{
                      marginRight: 10,
                      marginVertical: 15,
                      borderRadius: 25,
                      height: 50,
                      flexDirection: 'row',
                      backgroundColor:
                        pressedIndex != index ? '#549670' : 'white',
                      alignSelf: 'flex-start',
                      alignItems: 'center',
                    }}>
                    <Text
                      style={{
                        paddingHorizontal: 15,
                        color: pressedIndex != index ? 'white' : '#549670',
                        fontSize: 14
                      }}>
                      {value.kategori}  
                      <Text style={{color: '#e5e5e5'}}>   {dataFire.filter((v) => (v.kategori === value.kategori)).length}</Text>
                    </Text>
                  </TouchableOpacity>
                );
              }
            })}
          </ScrollView>
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
                                height: 150,
                                borderTopLeftRadius: 15,
                                borderTopRightRadius: 15,
                              }}
                            />
                          </View>
                          <View style={{flexShrink: 1, margin: 5,justifyContent:'center',alignItems:'center'}}>
                            <Text style={{color: 'black', fontSize: 16}}>
                              {x.namabarang}
                            </Text>
                            <Text style={{color: 'black', fontSize: 14}}>
                              {x.kategori}
                            </Text>
                            <Text>
                            </Text>
                            <Text style={{color: 'grey', marginTop: 10}}>
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
                        style={{...styles.item, borderWidth: 7}}>
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
                                height: 150,
                                borderTopLeftRadius: 15,
                                borderTopRightRadius: 15,
                              }}
                            />
                          </View>
                          <View style={{flexShrink: 1, margin: 5, alignItems:'center'}}>
                            <Text style={{color: 'black', fontSize: 15, fontWeight: 'bold'}}>
                              {x.namabarang}
                            </Text>
                            <Text style={{color: 'black', fontSize: 14}}>
                              {x.kategori}
                            </Text>
                            <Text></Text>
                            <Text style={{color: '#808080', marginTop: 5, marginBottom: 5}}>
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
      </View>
    );
  }
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#00ca74',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
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
    borderColor: 'rgba(158, 150, 150, .0)',
    borderRadius: 22,
  },
});
