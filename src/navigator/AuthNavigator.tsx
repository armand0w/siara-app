import React, { useContext } from 'react';

import { AuthContext } from '../context/AuthContext';

import { createStackNavigator } from '@react-navigation/stack';
import { LoginScreen } from '../screens/LoginScreen';
import { StatusScreen } from '../screens/StatusScreen';
import { LoadingScreen } from '../screens/LoadingScreen';
import { SiaraNavigator } from './SiaraNavigator';
import { useColorScheme } from 'react-native';
import { Colors } from 'react-native/Libraries/NewAppScreen';

const Stack = createStackNavigator();

export const AuthNavigator = () => {
  const { status } = useContext(AuthContext);
  const isDarkMode = useColorScheme() === 'dark';

  if ( status === 'checking' ) {
    return <LoadingScreen/>;
  }

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        title: 'SIARA',
        cardStyle: {
          backgroundColor: isDarkMode ? Colors.black : Colors.white,
        },
      }}
    >
      {
        ( status !== 'authenticated' )
          ? (
            <>
              <Stack.Screen name="LoginScreen" component={ LoginScreen }/>
              <Stack.Screen name="StatusScreen" component={ StatusScreen }/>
            </>
          ) : (
            <>
              <Stack.Screen name="SiaraNavigator" component={ SiaraNavigator }/>
            </>
          )
      }
    </Stack.Navigator>
  );
};
