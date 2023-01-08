import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface Props {
  title: string;
  description: string;
  hours: number;
  onPressFn?: () => void
}

export const CustomFlatRow = ( { title, description, hours, onPressFn }: Props ) => {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={ onPressFn }
    >
      <Text style={ styles.photo }>
        { hours }
      </Text>
      <View style={styles.containerText}>
        <Text style={styles.title}>
          {title}
        </Text>
        <Text style={styles.description}>
          {description}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    padding: 10,
    marginLeft:16,
    marginRight:16,
    marginTop: 8,
    marginBottom: 8,
    borderRadius: 5,
    backgroundColor: '#FFF',
    elevation: 2,
  },
  title: {
    fontSize: 16,
    color: '#000',
  },
  containerText: {
    flex: 1,
    flexDirection: 'column',
    marginLeft: 12,
    justifyContent: 'center',
  },
  description: {
    fontSize: 11,
    fontStyle: 'italic',
    color: '#000',
  },
  photo: {
    color: '#000',
    fontSize: 50,
  },
});
