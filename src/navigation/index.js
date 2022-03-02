import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {Component} from 'react/cjs/react.production.min';
import LoginScreen from "../screens/loginScreen"
import RegisterScreen from "../screens/registerScreen"
import ForgotScreen from "../screens/forgotScreen"
import OnboardScreen from "../screens/onboardScreen"
import HomeScreen from "../screens/homeScreen";

const Stack = createNativeStackNavigator();
export default class App extends Component {
  render() {
    return (
      <NavigationContainer>
        <Stack.Navigator initialRouteName='OnboardScreen'>
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
        </Stack.Navigator>
      </NavigationContainer>
    );
  }
}
