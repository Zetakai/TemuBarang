import {Text, StyleSheet, View, Image, ScrollView} from 'react-native';
import React, {Component} from 'react';
import CText from '../../components/atoms/CText';

export default class Index extends Component {
  render() {
    return (
      <ScrollView style={styles.container}>
        <View style={{backgroundColor: 'white'}}>
          <Image
            source={require('../../assets/dummy.png')}
            style={{flex:1}}
          />
        </View>
        <View style={{padding: 5, backgroundColor:'white'}}>
          <CText style={{fontSize: 30, fontWeight: 'bold'}}>Nama Barang</CText>
          <Text>Lokasi ditemukan barang</Text>
        </View>
        <View style={{padding: 5, backgroundColor: 'white', marginBottom: 3}}>
          <CText style={{fontSize: 25}}>Deskripsi</CText>
          <Text>Nomor apa</Text>
          <Text>sesuatu</Text>
          <Text>apa</Text>
          <Text>ntah</Text>
        </View>
        <View style={{padding: 5, flexDirection: 'row', backgroundColor: 'white', marginBottom: 3}}>
          <View style={{marginRight: 10}}>
          <Image
            style={styles.avatar}
            source={{
              uri: 'https://www.shareicon.net/data/2016/09/01/822742_user_512x512.png',
            }}
          />
          </View>
          <View style={{justifyContent: 'center'}}>
          <Text>
            Posted by
          </Text>
          <Text>
            Nama yang upload
          </Text>
          </View>
        </View>
        <View style={{padding: 5, flexDirection: 'row', backgroundColor: 'white', marginBottom: 3}}>
          <CText>Comments</CText>
          <View>
            
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
});
