import React from 'react';

import { Image, View } from 'react-native';

export const PMGroupLogo = () => {
  return (
    <View style={{
      alignItems: 'center',
    }}>
      <Image
        source={ require('../assets/grupopm_ch.png') }
        style={{
          width: 120,
          height: 120,
        }}
      />
    </View>
  );
};
