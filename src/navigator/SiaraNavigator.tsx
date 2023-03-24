import React from 'react';

import { createStackNavigator } from '@react-navigation/stack';

import { HomeScreen } from '../screens/HomeScreen';
import { HistoricoHorasScreen } from '../screens/HistoricoHorasScreen';
import { HorasCargadas } from '../screens/HorasCargadas';
import { ReporteHoras } from '../screens/ReporteHoras';
import { FrmCargaHorasScreen } from '../screens/FrmCargaHorasScreen';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import { useColorScheme } from 'react-native';

export type SiaraStackParams = {
  HomeScreen: undefined,
  HistoricoHorasScreen: undefined,
  HorasCargadasScreen: undefined,
  ReporteHorasScreen: undefined,
  FrmCargaHorasScreen: { id?: string, canShowDelete: boolean },
}

const Stack = createStackNavigator<SiaraStackParams>();

export const SiaraNavigator = () => {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <Stack.Navigator
      screenOptions={{
        cardStyle: {
          backgroundColor: isDarkMode ? Colors.black : Colors.white,
        },
        headerStyle: {
          elevation: 0,
          // shadowColor: 'transparent',
          backgroundColor: isDarkMode ? Colors.black : Colors.white,
        },
        headerTintColor: isDarkMode ? Colors.white : Colors.black,
      }}
    >
      <Stack.Screen name="HomeScreen" component={ HomeScreen } options={{ title: 'SIARA' }}/>
      <Stack.Screen name="HistoricoHorasScreen" component={ HistoricoHorasScreen } options={{ title: 'Historico de horas', headerShown: true }}/>
      <Stack.Screen name="HorasCargadasScreen" component={ HorasCargadas } options={{ title: 'Horas de esta semana', headerShown: true }}/>
      <Stack.Screen name="ReporteHorasScreen" component={ ReporteHoras } options={{ title: 'Reporte de horas', headerShown: true }}/>
      <Stack.Screen name="FrmCargaHorasScreen" component={ FrmCargaHorasScreen } options={{ title: 'Agregar actividad', headerShown: true }}/>
    </Stack.Navigator>
  );
};
