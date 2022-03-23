import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createMaterialBottomTabNavigator} from '@react-navigation/material-bottom-tabs';
import {Component} from 'react/cjs/react.production.min';
import {
  HomeScreen,
  LoginScreen,
  RegisterScreen,
  ForgotScreen,
  OnboardScreen,
  SplashScreen,
  UploadScreen,
  ProfileScreen,
  LostScreen,
  FoundScreen,
  DetailsScreen,
  MessageScreen,
  NotifScreen,
  ListMesaages,
  NotifDetailsScreen,
  ReplyScreen

} from '../screens/screens';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const Stack = createNativeStackNavigator();
const Tab = createMaterialBottomTabNavigator();

export class TabNav extends Component {
  render(){
  return (
    <Tab.Navigator
      initialRouteName="Home"
      activeColor="green"
      barStyle={{backgroundColor: 'white',borderTopColor:'silver',borderTopWidth:1}}>
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({color}) => (
            <MaterialCommunityIcons name="home" color={color} size={26} />
          ),
        }}
      />
      <Tab.Screen
        options={{
          tabBarLabel: 'Pesan',
          tabBarIcon: ({color}) => (
            <MaterialCommunityIcons name="chat-processing" color={color} size={26} />
          ),
        }}
        name="Pesan"
        component={ListMesaages}
      />
      <Tab.Screen
        name="UploadScreen"
        component={UploadScreen}
        options={{
          tabBarLabel: 'Upload',
          tabBarIcon: ({color}) => (
            <MaterialCommunityIcons name="camera-enhance" color={color} size={26} />
          )
        }}
      />
      <Tab.Screen
        options={{
          tabBarLabel: 'Notifications',
          tabBarIcon: ({color}) => (
            <MaterialCommunityIcons name="bell" color={color} size={26} />
          ),
        }}
        name="NotifScreen"
        component={NotifScreen}
      />
       <Tab.Screen
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: ({color}) => (
            <MaterialCommunityIcons name="account" color={color} size={26} />
          ),
        }}
        name="ProfileScreen"
        component={ProfileScreen}
      />
      </Tab.Navigator>
  );
}};
export default class App extends Component {
 
  render() {
    return (
      <NavigationContainer>
        <Stack.Navigator initialRouteName="SplashScreen">
        <Stack.Screen
            name="SplashScreen"
            component={SplashScreen}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="TabNav"
            component={TabNav}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="OnboardScreen"
            component={OnboardScreen}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="LoginScreen"
            component={LoginScreen}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="RegisterScreen"
            component={RegisterScreen}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="ForgotScreen"
            component={ForgotScreen}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="HomeScreen"
            component={HomeScreen}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="UploadScreen"
            component={UploadScreen}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="ProfileScreen"
            component={ProfileScreen}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="FoundScreen"
            component={FoundScreen}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="LostScreen"
            component={LostScreen}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="DetailsScreen"
            component={DetailsScreen}
            optio
            ns={{headerShown: false}}
          />
          <Stack.Screen
            name="NotifDetailsScreen"
            component={NotifDetailsScreen}
            options={{headerShown: false}}
          />
           <Stack.Screen
            name="Messaging"
            component={MessageScreen}
            options={{headerShown: false}}
          />
           <Stack.Screen
            name="ReplyScreen"
            component={ReplyScreen}
            />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }
}
