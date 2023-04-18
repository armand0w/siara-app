import React from 'react';

import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';

import { AuthNavigator } from './src/navigator/AuthNavigator';
import { AuthProvider } from './src/context/AuthContext';
import { HorasProvider } from './src/context/HorasContext';

import * as Sentry from '@sentry/react-native';

Sentry.init({
  dsn: 'https://ba39ed51b69349c8a9cc830f199dc263@o4503943605387264.ingest.sentry.io/4504930005811200',
  environment: 'develop',
});


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
