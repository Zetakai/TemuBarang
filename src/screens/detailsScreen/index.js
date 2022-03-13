import {Text, StyleSheet, View, Image, ScrollView} from 'react-native';
import React, {Component} from 'react';
import CText from '../../components/atoms/CText';

export default class Index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
    };
  }
  componentDidMount() {
    const {params} = this.props.route;
    this.setState({data: params});
  }
  render() {
    const {data} = this.state;
    console.log(data);
    return (
      <ScrollView style={styles.container}>
        <View style={{margin: 10, borderWidth: 5, borderColor: 'black'}}>
          <View style={{backgroundColor: 'white'}}>
            {data.photoURL != null ? (
              <Image
                source={{uri: `${data.photoURL}`}}
                style={{width: 220, height: 220, borderRadius: 25}}
              />
            ) : (
              <Image
                source={require('../../assets/dummy.png')}
                style={{width: '100%', height: 200}}
              />
            )}
          </View>
          <View style={{padding: 5, backgroundColor: 'white'}}>
            <CText style={{fontSize: 30, fontWeight: 'bold'}}>
              {data.namabarang}
            </CText>
            <Text>Lokasi : {data.lokasi}</Text>
          </View>
          <View style={{padding: 5, backgroundColor: 'white', marginBottom: 3}}>
            <CText style={{fontSize: 25}}>Deskripsi</CText>
            <Text style={styles.textcolor}>Nomor apa</Text>
            <Text style={styles.textcolor}>sesuatu</Text>
            <Text style={styles.textcolor}>apa</Text>
            <Text style={styles.textcolor}>ntah</Text>
          </View>
          <View
            style={{
              padding: 5,
              flexDirection: 'row',
              backgroundColor: 'white',
              marginBottom: 3,
            }}>
            <View style={{marginRight: 10}}>
              <Image
                style={styles.avatar}
                source={{
                  uri: 'https://www.shareicon.net/data/2016/09/01/822742_user_512x512.png',
                }}
              />
            </View>
            <View style={{justifyContent: 'center'}}>
              <Text>Posted by</Text>
              <Text>Nama yang upload</Text>
            </View>
          </View>
          <View
            style={{
              padding: 5,
              flexDirection: 'row',
              backgroundColor: 'white',
              marginBottom: 3,
            }}>
            <CText>Comments</CText>
            <View></View>
          </View>
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'darkgrey',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 63,
    borderWidth: 3,
    borderColor: 'black',
    margin: 10,
  },
  textcolor: {color: 'black'},
});
