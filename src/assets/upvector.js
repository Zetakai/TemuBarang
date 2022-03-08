import React from "react";
import {View,Text,StyleSheet}from "react-native"; 
import {Svg,Path}from "react-native-svg";

export default class upvector extends Component {
  render() {
    return (
      <View>
        <Text><Svg style ={styles._Vector_9}fill={"rgba(31, 27, 26, 1)"}>
    <Path fillRule={"none"}
    d={"M 0 0 L 0 78.35051274389717 C 27.573529411764707 89.84192127966875 105.28074866310162 109.89965234285077 195.52139037433156 98.19930930568445 C 308.322192513369 83.57388026015698 253.6764705882353 155.6563519845424 375 143.64260669714483 L 375 0 L 0 0 Z"}
    /></Svg></Text>
      </View>
    )
  }
}

const styles = StyleSheet.create({
    
    _Vector_9 :{
        position:"absolute",
        color:
        "rgba(31, 27, 26, 1)",
        width:375,
        height:145,
        borderRadius:0,
        transform:[{translateX:0},{
        translateY:0},{rotate:"0deg"},]
    }


})

    
    


