import React from 'react';
import { StyleSheet, Text, TouchableOpacity, useColorScheme, View } from 'react-native';
import { Colors } from 'react-native/Libraries/NewAppScreen';

interface Props {
  title: string;
  description: string;
  hours: number;
  task: string;
  onPressFn?: () => void
}

export const CustomFlatRow = ( { title, description, hours, task, onPressFn }: Props ) => {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <TouchableOpacity
      style={{
        ...styles.container,
        backgroundColor: isDarkMode ? Colors.black : Colors.lighter,
        borderColor: isDarkMode ? Colors.dark : Colors.light,
      }}
      onPress={ onPressFn }
    >
      <Text style={{
        ...styles.horas,
        color: isDarkMode ? Colors.white : Colors.black,
      }}>
        { hours }
      </Text>
      <View style={styles.containerText}>
        <Text style={{
          ...styles.title,
          color: isDarkMode ? Colors.white : Colors.black,
        }}>
          { title }
        </Text>
        <Text style={{
          ...styles.description,
          color: isDarkMode ? Colors.white : Colors.black,
        }}>
          { description }
        </Text>
        <Text style={{
          ...styles.task,
          color: isDarkMode ? Colors.white : Colors.black,
        }}>
          { task }
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
    //backgroundColor: '#FFF',
    elevation: 10,
    borderWidth: 0.5,
  },
  title: {
    fontSize: 15,
    fontWeight: '600',
    // color: '#000',
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
    // color: '#000',
  },
  task: {
    fontSize: 10,
    fontWeight: 'bold',
    // color: '#000',
  },
  horas: {
    // color: '#000',
    fontSize: 50,
  },
});
