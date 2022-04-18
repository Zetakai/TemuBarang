import {Text, StyleSheet, View, Image} from 'react-native';
import React, {Component} from 'react';
import { convertDateTime } from '../../components/utils/moment';

export default class NotifDetailsScreen extends Component {
  constructor() {
    super();
    this.state = {
      data: [],
    };
  }

  componentDidMount() {
    this._getData();
  }

  _getData = () => {
    const {params} = this.props.route;
    this.setState({data: params});
  };

  render() {
    const {data} = this.state;
    console.log(data);
    return (
      <View style={styles.container}>
        <Text style={styles.inboxTitle}>{data.title}</Text>
        <Text style={styles.inboxDate}>{convertDateTime(new Date(data.sentTime))}</Text>
        {data.img != null &&
          <Image
            style={{width: 200, height: 200, alignSelf:'center'}}
            source={{uri: `${data.img}`}}
          />
        }
        <Text style={styles.inboxBody}>{data.body}</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex:1,
    padding: 10,
    backgroundColor: 'white'
  },
  inboxTitle: {
    color: 'black',
    fontSize: 20,
    fontWeight: 'bold',
  },
  inboxBody: {
    color: 'black',
    fontSize: 15,
    paddingTop: 10,
  },
  inboxDate: {
    fontSize: 13,
    color: '#808080',
    paddingBottom: 10,
  },
});
