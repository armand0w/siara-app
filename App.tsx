import React from 'react';

import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';

import { AuthNavigator } from './src/navigator/AuthNavigator';
import { AuthProvider } from './src/context/AuthContext';
import { HorasProvider } from './src/context/HorasContext';

const AppState = ({ children }: any) => {
  return (
    <AuthProvider>
      <HorasProvider>
        { children }
      </HorasProvider>
    </AuthProvider>
  );
};

export const App = () => {
  return (
    <NavigationContainer>
      <AppState>
        <AuthNavigator/>
      </AppState>
    </NavigationContainer>
  );
};
