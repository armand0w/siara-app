import React from 'react';
import { StyleSheet, View } from 'react-native';
import { colors } from '../theme/colors';

export const Background = () => {
  return (
    <View style={ styles.background }/>
  );
};

const styles = StyleSheet.create({
  background: {
    position: 'absolute',
    backgroundColor: colors.primary,
    top: -250,
    width: 1000,
    height: 1100,
    transform: [
      { rotate: '-70deg' },
    ],
  },
});
