import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

interface Props {
  title: string;
  number: number;
  iconBackground: string;
  iconName: string;
  screenOnPress?: () => void
}

export const Card = ({ title, number, iconBackground, iconName, screenOnPress }: Props) => {

  return (
    <TouchableOpacity
      style={{
        ...styles.card,
        borderColor: iconBackground,
      }}
      onPress={ screenOnPress }
    >
      <View style={{
        ...styles.cardIcon,
        backgroundColor: iconBackground,
      }}>
        <Icon name={ iconName } size={ 45 } color="white"/>
      </View>
      <View style={{
        flex: 1,
        alignItems: 'flex-end',
      }}>
        <Text style={ styles.cardText }>{ title }</Text>
        <Text style={ styles.cardNumber }>{ number }</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    // flex: 1,
    borderWidth: 0.8,
    borderRadius: 15,
    margin: 10,
    padding: 20,
    flexDirection: 'row',
    backgroundColor: 'white',
  },
  cardText: {
    fontSize: 18,
    fontStyle: 'italic',
    color: 'black',
    justifyContent: 'flex-end',
  },
  cardNumber: {
    position: 'absolute',
    top: 50,
    right: -10,
    fontSize: 30,
    color: 'black',
  },
  cardIcon: {
    width: 70,
    height: 70,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
});
