import {
  Text,
  StyleSheet,
  View,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import React, {Component} from 'react';

export default class Index extends Component {
  render() {
    return (
      <View style={{backgroundColor: 'white', flex: 1}}>
        <View style={styles.header}>
          <View>
            <Text style={{fontSize: 25, fontWeight: 'bold', color: 'green'}}>
              TemuBarang
            </Text>
          </View>
          <View>
            <TouchableOpacity>
              <Text>Icon profile here</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View>
          <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} style={{marginVertical: 20}}>
            <TouchableOpacity style={{...styles.menu, backgroundColor: 'green'}}>
              <Text style={styles.cardText}>Barang Ditemukan</Text>
            </TouchableOpacity>
            <TouchableOpacity style={{...styles.menu, backgroundColor: 'brown'}}>
              <Text style={styles.cardText}>Barang Hilang</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
        <ScrollView style={{flex: 1, marginTop: 20}}>
          <Text>Something here..</Text>
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
    borderColor: 'silver'
  },
  menu: {
    flex: 1,
    width: 220,
    height: 220,
    marginHorizontal: 10,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center'
  },
  cardText: {
    fontStyle: 'italic', 
    fontWeight:'bold', 
    fontSize: 20
  }
});
