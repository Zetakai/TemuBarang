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
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import {colors, fonts, responsiveWidth} from '../../components/utils/Utility';
import CGap from '../../components/CGap';
import CText from '../../components/atoms/CText';
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
    console.log(auth().currentUser)
    this.mounted = true;
    //this.props.addProfile(auth().currentUser);
    await firestore()
      .collection('Lost')
      .onSnapshot(x => {if(x!=null){
        let user = x.docs.map(y => {
          return y.data();
        });
        let cup = user.map(x => {
          return x.posts;
        });
        let sorted = cup.flat().sort((a, b) => b.time - a.time);
        this.mounted == true && this.setState({dataLost: sorted.slice(0, 3)});
      }})
    await firestore()
      .collection('Found')
      .onSnapshot(x => {if(x!=null){
        let user = x.docs.map(y => {
          return y.data();
        });
        let cup = user.map(x => {
          return x.posts;
        });
        let sorted = cup.flat().sort((a, b) => b.time - a.time);
        this.mounted == true && this.setState({dataFound: sorted.slice(0, 3)});
      }})
      this.props.update()
  }
  componentWillUnmount() {
    this.mounted = false;
  }
  _userLogout = () => {
    auth()
      .signOut()
      .then(() => {
        console.log('User signed out!');
        this.props.navigation.replace('OnboardScreen');
      }).then(this.props.logout());
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
    const {user}=this.props
    const {dataLost, dataFound, expandProfile, refreshing} = this.state;
    return (
      <View style={{backgroundColor: 'white', flex: 1}}>
        <View
          onPress={() => this.setState({expandProfile: !expandProfile})}>
          <View style={styles.header}>
            <View>
              <Text style={{fontSize: 25, fontWeight: 'bold', color: '#43bdb5'}}>
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
                  color: '#43bdb5',
                  marginRight: 5,
                }}>
                Log out
              </Text>
              <TouchableOpacity
                onPress={() => this.props.navigation.navigate('ProfileScreen')}>
                <View>
                  <Image
                    style={styles.circleImage}
                    source={{uri: `${user.photoURL}`}}
                  />
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </View>
        
          <View style={styles.expProfile}>
            {/* <Image
              style={styles.avatar}
              source={{
                uri: `${user.photoURL}`
              }}
            /> */}
              <Text style={{marginLeft:15,fontSize:25,color:'white'}}>
              Hello,
            </Text>
            <Text style={{marginLeft:15,fontSize:18,color:'white'}}>
              {user.displayName}
            </Text>
            <View style={{flexDirection:'row',justifyContent:'center',marginVertical:10}}>
              <TouchableOpacity style={{width: '45%', height: 150,backgroundColor:'white',borderRadius:5,justifyContent:'center',alignItems:'center'}} onPress={() => {
              this.props.navigation.navigate('LostScreen')}}><View><View style={{flexDirection:'row',alignItems:'center',justifyContent:'space-evenly'}}><Image
              style={{width: 50,
                height: 50,
                borderRadius: 150 / 2,
                borderWidth: 1,
                borderColor: 'black',}}
              source={{
                uri: `https://cdn-icons-png.flaticon.com/512/1201/1201867.png?w=740&t=st=1648131697~exp=1648132297~hmac=d6bfe1e0bc84ce6f6d951f667c23e8bad006e6603955034d481ec6eedcb5f1e4`
              }}
            /><Text style={{color:'black'}}>Lost Items</Text></View><Text style={{color:'silver'}}>Umumkan barangmu yang hilang disini</Text></View></TouchableOpacity>
              <TouchableOpacity style={{marginLeft:10,width: '45%', height: 150,backgroundColor:'white',borderRadius:5,justifyContent:'center',alignItems:'center'}} onPress={() => {
              this.props.navigation.navigate('FoundScreen')}}><View><View style={{flexDirection:'row',alignItems:'center',justifyContent:'space-evenly'}}><Image
              style={{width: 50,
                height: 50,
                borderRadius: 150 / 2,
                borderWidth: 1,
                borderColor: 'black',}}
              source={{
                uri: `https://cdn4.iconfinder.com/data/icons/search-blue-line/64/168_search-magnifier-find-item-cargo-1024.png`
              }}
            /><Text style={{color:'black'}}>Found Items</Text></View><Text style={{color:'silver'}}>Temukan barangmu yang hilang disini</Text></View></TouchableOpacity>
            </View>
          </View>
        

        <View
          style={{
            flexDirection: 'row',
            marginTop: 15,
            justifyContent: 'space-evenly',
          }}>
         
        </View>
        {/* <View
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
        </View> */}
        <ScrollView
          style={{marginTop: -15}}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={this._onRefresh}
            />
          }>
          <View style={{marginBottom: 20}}>
            <Text style={{color: 'black', marginLeft: 25}}>
              Barang Temuan Terbaru
            </Text>
            <ScrollView
              horizontal={true}
              showsHorizontalScrollIndicator={false}>
              {dataFound.map((x, i) => {
                return (x&&
                  <TouchableOpacity
                    key={i}
                    style={{...styles.menu, backgroundColor: '#a4d2ac'}}
                    onPress={() =>
                      this.props.navigation.navigate('DetailsScreen', x)
                    }>
                    <View style={{flexDirection: 'row', flex: 1}}>
                        <Image
                          source={
                            x.photoURL
                              ? {uri: `${x.photoURL}`}
                              : require('../../assets/galeryImages.jpeg')
                          }
                          style={{width: 172, height: 182, borderRadius: 15}}
                        />
                      </View>
                      <View style={{justifyContent: 'center', flex: 1}}>
                      <Text style={{alignSelf: 'center', fontWeight: 'bold', paddingBottom: 5,color:'black'}}>{x.namabarang}</Text>
                        <Text style={{color:'black'}}>Kategori :{x.kategori}</Text>
                        <Text style={{color: 'white', marginTop: 5}}>
                              <EvilIcons name="location" size={16} />
                              {x.lokasi}
                            </Text>
                            
                           <CGap height={60}/>
                           <CText style={styles.element}>BAGIKAN 
                           <CGap width={2}/>

                           <FontAwesome5 name="share" color={colors.white}  size={20} />
                           <CGap width={2}/>
                           <Text style={{color:'white'}}>:
                           <CGap width={5}/>
                           <FontAwesome5  name="facebook" color={colors.primary}  size={20} />
                           <CGap width={5}/>
                           <FontAwesome5 name="whatsapp" color={'green'}  size={20} />
                           <CGap width={5}/>
                           <FontAwesome5 name="link" color={colors.gray}  size={20} />
                           </Text>


                           </CText>


                      </View>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
          <View style={{marginBottom: 20}}>
            <Text style={{color: 'grey', marginLeft: 25}}>
            Barang Hilang Terbaru
            </Text>
            <ScrollView
              horizontal={true}
              showsHorizontalScrollIndicator={false}>
              {dataLost.map((x, i) => {
                return (x&&
                  <TouchableOpacity
                    key={i}
                    style={{...styles.menu, backgroundColor: '#ccb494'}}
                    onPress={() =>
                      this.props.navigation.navigate('DetailsScreen', x)
                    }>
                    <View style={{flexDirection: 'row', flex: 1}}>
                        <Image
                          source={
                            x.photoURL
                              ? {uri: `${x.photoURL}`}
                              : require('../../assets/galeryImages.jpeg')
                          }
                          style={{width: 172, height: 182, borderRadius: 15}}
                        />
                      </View>
                      <View style={{justifyContent: 'center', flex: 1}}>
                        <Text style={{alignSelf: 'center', fontWeight: 'bold', paddingBottom: 5,color:'black'}}>{x.namabarang}</Text>
                        <Text style={{color:'black'}}>Kategori :{x.kategori}</Text>
                        <Text style={{color: 'white', marginTop: 5}}>
                              <EvilIcons name="location" size={16} />
                              {x.lokasi}
                            </Text>
                            <CGap height={60}/>
                           <CText style={styles.element}>BAGIKAN 
                           <CGap width={2}/>

                           <FontAwesome5 name="share" color={colors.white}  size={20} />
                           <CGap width={2}/>
                           <Text style={{color:'white'}}>:
                           <CGap width={5}/>
                           <FontAwesome5  name="facebook" color={colors.primary}  size={20} />
                           <CGap width={5}/>
                           <FontAwesome5 name="whatsapp" color={'green'}  size={20} />
                           <CGap width={5}/>
                           <FontAwesome5 name="link" color={colors.gray}  size={20} />
                           </Text>


                           </CText>
                      </View>
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
    borderRadius: 15,
    width: 363,
    height: 182,
    flexDirection: 'row'
  },
  cardText: {
    fontStyle: 'italic',
    fontWeight: 'bold',
    fontSize: 20,
  },
  expProfile: {
    backgroundColor: '#43BDB5',
    
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
  element:{
    backgroundColor:colors.black ,
    color:colors.redmuda, 
    fontFamily: fonts.primary.Entypo,
    borderBottomColor:colors.black,
    borderRadius:10,
    padding:'5%',
    marginRight:10,
    
    flexDirection:'row',
    shadowColor:'#000',
shadowOffset: {
	width: 0,
	height: 4,
},
shadowOpacity: 0.32,
shadowRadius: 5.46,

elevation: 25,
  }
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
