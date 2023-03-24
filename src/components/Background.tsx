import React from 'react';
import { StyleSheet, useColorScheme, View } from 'react-native';
import { colors } from '../theme/colors';

export const Background = () => {
  const isDarkMode = useColorScheme() === 'dark';
  return (
    <View style={{
      ...styles.background,
      backgroundColor: isDarkMode ? colors.secondary : colors.primary,
    }}/>
  );
};

const styles = StyleSheet.create({
  background: {
    position: 'absolute',
    top: -250,
    width: 1000,
    height: 1100,
    transform: [
      { rotate: '-70deg' },
    ],
  },
});
