import React, { useEffect } from 'react';
import { ActivityIndicator, useColorScheme, View } from 'react-native';
import SplashScreen from 'react-native-splash-screen';
import { colors } from '../theme/colors';

export const LoadingScreen = () => {
  const isDarkMode = useColorScheme() === 'dark';

  useEffect(() =>{
    SplashScreen.hide();
  }, []);

  return (
    <View style={{
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: isDarkMode ? colors.secondary : colors.primary,
    }}>
      <ActivityIndicator
        size={ 70 }
        color="white"
      />
    </View>
  );
};
