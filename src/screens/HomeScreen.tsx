import React, { useContext, useEffect, useState } from 'react';
import { RefreshControl, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { StackScreenProps } from '@react-navigation/stack';

import { AuthContext } from '../context/AuthContext';
import { Card } from '../components/Card';
import { SiaraStackParams } from '../navigator/SiaraNavigator';
import { HorasContext } from '../context/HorasContext';

interface Props extends StackScreenProps<SiaraStackParams, 'HomeScreen'>{}

export const HomeScreen = ( { navigation }: Props ) => {
  const { logOut } = useContext(AuthContext);
  const { horasSemana, loadHorasSemanaActual } = useContext(HorasContext);
  const [ horasCargadas, setHorasCargadas ] = useState(0);
  const [ horasNoCargadas, setHorasNoCargadas ] = useState(0);
  const [ proyectos, setProyectos ] = useState(0);
  const [ isRefreshing, setIsRefreshing ] = useState(false);

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          activeOpacity={ 0.7 }
          style={{ marginRight: 10 }}
          onPress={ logOut }
        >
          <Text style={ styles.logout }>Logout</Text>
        </TouchableOpacity>
      ),
    });
  }, []);

  useEffect(() => {
    let total = horasSemana.reduce( ( sum, { cargaHoras } ) => sum + cargaHoras , 0);
    const projects: any = {};

    horasSemana.forEach((el) => {
      projects[ (el.proyecto.proyNomCorto) ? el.proyecto.proyNomCorto : ''] =
        projects[el.proyecto.idProyecto] ? (projects[el.proyecto.idProyecto] + 1) : 1;
    });

    setHorasCargadas( total );
    setHorasNoCargadas( 45 - total );
    setProyectos( Object.entries(projects).length );
  }, [horasSemana]);

  const onRefresh = async () => {
    setIsRefreshing(true);
    await loadHorasSemanaActual();
    setIsRefreshing(false);
  };

  return (
    <ScrollView
      contentContainerStyle={ styles.container }
      refreshControl={ <RefreshControl refreshing={ isRefreshing } onRefresh={ onRefresh }/> }
    >
      <View style={ styles.container }>
        <Card
          number={ horasCargadas }
          title="Horas cargadas"
          iconBackground="#26c6da"
          iconName="alarm-outline"
          screenOnPress={ () => navigation.navigate('HistoricoHorasScreen') }
        />
        <Card
          number={ horasNoCargadas }
          title="Horas pendientes de cargar"
          iconBackground="#ec407a"
          iconName="time-outline"
          screenOnPress={ () => navigation.navigate('HorasCargadasScreen') }
        />
        <Card
          number={ proyectos }
          title="Proyectos con horas registradas"
          iconBackground="#66bb6a"
          iconName="folder-outline"
          screenOnPress={ () => navigation.navigate('ReporteHorasScreen') }
        />
      </View>
    </ScrollView>

  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-evenly',
    // alignItems: 'center',
    backgroundColor: '#f1f1f1',
  },
  title: {
    fontSize: 20,
    marginBottom: 20,
    color: '#000',
  },
  logout: {
    fontSize: 15,
    color: '#777777',
  },
});
