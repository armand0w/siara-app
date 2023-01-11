import React, { useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';
import SplashScreen from 'react-native-splash-screen';

export const LoadingScreen = () => {

  useEffect(() =>{
    SplashScreen.hide();
  }, []);

  return (
    <View style={{
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#e53935',
    }}>
      <ActivityIndicator
        size={ 70 }
        color="white"
      />
    </View>
  );
};
