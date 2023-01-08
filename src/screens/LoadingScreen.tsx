import React from 'react';
import { ActivityIndicator, View } from 'react-native';

export const LoadingScreen = () => {
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
