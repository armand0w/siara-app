import React, { useContext, useEffect, useState } from 'react';

import { RefreshControl, SectionList, StyleSheet, Text, View } from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import { SiaraStackParams } from '../navigator/SiaraNavigator';

import { CargaHoras } from '../interfaces/appInterfaces';
import { CustomFlatRow } from '../components/CustomFlatRow';
import { Fab } from '../components/Fab';
import { HorasContext } from '../context/HorasContext';

interface Props extends StackScreenProps<SiaraStackParams, 'HorasCargadasScreen'>{}

export const HorasCargadas = ( { navigation }: Props ) => {
  const { horasSemana, loadHorasSemanaActual } = useContext(HorasContext);
  const [ sectionsList, setSectionsList ] = useState<any>([]);
  const [ isRefreshing, setIsRefreshing ] = useState(false);

  useEffect(() => {
    const days = ['Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado', 'Domingo'];
    let sectionsMap = new Map<string, CargaHoras[] | undefined>();
    let auxSectionsList = [];

    horasSemana.forEach((h) => {
      if ( h.cargaFecha ) {
        if ( !sectionsMap.has(h.cargaFecha) ) {
          sectionsMap.set(h.cargaFecha, [ h ]);
        } else {
          let aux = sectionsMap.get(h.cargaFecha);
          aux?.push(h);
          sectionsMap.set(h.cargaFecha, aux);
        }
      }
    });

    for ( let sectionTitle of sectionsMap.keys() ) {
      auxSectionsList.push({
        title: `${days[new Date(Date.parse(sectionTitle)).getDay()]} ${sectionTitle}`,
        data: sectionsMap.get(sectionTitle),
      });
    }

    setSectionsList(auxSectionsList);
  }, [horasSemana]);

  const onRefresh = async () => {
    setIsRefreshing(true);
    await loadHorasSemanaActual();
    setIsRefreshing(false);
  };

  return (
    <View style={{ flex: 1 }}>
      <SectionList
        sections={ sectionsList }
        initialNumToRender={ 5 }
        renderSectionHeader={({section}) => <Text style={styles.sectionHeader}>{section.title}</Text>}
        keyExtractor={ (item) => `cargaSemana-${item.idCargaHoras}` }
        renderItem={({ item }) => (
          <CustomFlatRow
            key={ item.idCargaHoras }
            title={ item.cargaTitulo }
            description={ item.cargaDescripcion }
            hours={ item.cargaHoras }
            tarea={ item.tarea.tareaDescripcion }
            onPressFn={ () => navigation.navigate('FrmCargaHorasScreen', { id: item.idCargaHoras.toString(), canShowDelete: true }) }
          />
        )}
        refreshControl={
          <RefreshControl refreshing={ isRefreshing } onRefresh={ onRefresh }/>
        }
      />

      <Fab
        title="+"
        position="br"
        onPress={ () => navigation.navigate('FrmCargaHorasScreen', { id: '', canShowDelete: false }) }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  sectionHeader: {
    paddingTop: 2,
    paddingLeft: 10,
    paddingRight: 10,
    paddingBottom: 2,
    fontSize: 14,
    fontWeight: 'bold',
    backgroundColor: 'rgba(247,247,247,1.0)',
    color: '#000',
  },
  item: {
    padding: 10,
    fontSize: 18,
    height: 44,
    color: '#000',
  },
});
