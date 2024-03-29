import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TouchableNativeFeedback, Platform } from 'react-native';
import { colors } from '../theme/colors';

interface Props {
  title: string;
  position?: 'br' | 'bl';
  onPress: () => void;
}

export const Fab = ({ title, onPress, position = 'br' }: Props) => {
  const ios = () => {
    return (
      <TouchableOpacity
        onPress={ onPress }
        activeOpacity={ 0.75 }
        style={[
          styles.fabLocation,
          ( position === 'bl' ) ? styles.left : styles.right,
        ]}>
        <View style={ styles.fab }>
          <Text style={ styles.fabText }>{ title }</Text>
        </View>
      </TouchableOpacity>
    );
  };

  const android = () => {
    return (
      <View style={[
        styles.fabLocation,
        ( position === 'bl' ) ? styles.left : styles.right,
      ]}>
        <TouchableNativeFeedback
          onPress={ onPress }
          background={ TouchableNativeFeedback.Ripple('#28425B', false, 30) }
        >
          <View style={ styles.fab }>
            <Text style={ styles.fabText }>{ title }</Text>
          </View>
        </TouchableNativeFeedback>
      </View>
    );
  };

  return ( Platform.OS === 'ios' ) ? ios() : android();
};

const styles = StyleSheet.create({
  fabLocation: {
    position: 'absolute',
    bottom: 25,
  },
  left: { left: 25 },
  right: { right: 25 },
  fab: {
    backgroundColor: colors.secondary,
    width: 60,
    height: 60,
    borderRadius: 100,
    justifyContent: 'center',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.30,
    shadowRadius: 4.65,
    elevation: 8,
  },
  fabText: {
    color: '#fff',
    fontSize: 40,
    fontWeight: 'bold',
    alignSelf: 'center',
  },
});
