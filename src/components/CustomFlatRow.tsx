import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface Props {
  title: string;
  description: string;
  hours: number;
  tarea: string;
  onPressFn?: () => void
}

export const CustomFlatRow = ( { title, description, hours, tarea, onPressFn }: Props ) => {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={ onPressFn }
    >
      <Text style={ styles.horas }>
        { hours }
      </Text>
      <View style={styles.containerText}>
        <Text style={styles.titulo}>
          { title }
        </Text>
        <Text style={styles.description}>
          { description }
        </Text>
        <Text style={styles.tarea}>
          { tarea }
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
    elevation: 10,
  },
  titulo: {
    fontSize: 15,
    fontWeight: '600',
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
  tarea: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#000',
  },
  horas: {
    color: '#000',
    fontSize: 50,
  },
});
