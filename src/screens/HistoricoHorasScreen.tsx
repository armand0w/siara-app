import React, { useContext, useEffect, useMemo, useState } from 'react';

import { RefreshControl, SectionList, StyleSheet, Text, useColorScheme, View } from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';

import { SiaraStackParams } from '../navigator/SiaraNavigator';
import { getHistoricoHorasCargadas } from '../api/siaraApi';
import { AuthContext } from '../context/AuthContext';
import { CargaHoras } from '../interfaces/appInterfaces';
import { CustomFlatRow } from '../components/CustomFlatRow';
import { Colors } from 'react-native/Libraries/NewAppScreen';

interface Props extends StackScreenProps<SiaraStackParams, 'HistoricoHorasScreen'>{}

export const HistoricoHorasScreen = ( { navigation }: Props ) => {
  const { user } = useContext(AuthContext);
  const [ horasHistorico, setHorasHistorico ] = useState<CargaHoras[]>([]);
  const [ isRefreshing, setIsRefreshing ] = useState(false);
  const isDarkMode = useColorScheme() === 'dark';

  const sectionsList: any[] = useMemo(() => {
    let auxSectionsList = [];

    if ( horasHistorico && horasHistorico.length > 0 ) {
      const days = ['Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado', 'Domingo'];
      let sectionsMap = new Map<string, CargaHoras[] | undefined>();

      horasHistorico.forEach( (h) => {
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
    }

    return auxSectionsList;
  }, [horasHistorico]);

  useEffect(() => {
    loadHistorico();
  }, [user]);

  const loadHistorico = async () => {
    if ( user ) {
      const historico = await getHistoricoHorasCargadas(user.matrizGenerales.empId);
      setHorasHistorico([...historico].reverse().slice(0, 50));
    }
  };

  const onRefresh = async () => {
    setIsRefreshing(true);
    await loadHistorico();
    setIsRefreshing(false);
  };

  return (
    <View style={{
      flex: 1,
      backgroundColor: isDarkMode ? Colors.black : Colors.lighter,
    }}>
      {
        ( sectionsList.length > 0 ) && (
          <SectionList
            sections={ sectionsList }
            initialNumToRender={ 10 }
            maxToRenderPerBatch={ 10 }
            updateCellsBatchingPeriod={ 10 }
            removeClippedSubviews={ false }
            onEndReachedThreshold={ 0.1 }
            renderSectionHeader={ ({section}) => <Text style={{
              ...styles.sectionHeader,
              backgroundColor: isDarkMode ? Colors.black : 'rgb(231,231,231)',
              color: isDarkMode ? Colors.primary : Colors.black,
            }}>{section.title}</Text> }
            keyExtractor={ (item) => `historico-${item.idCargaHoras}` }
            renderItem={({ item }) => (
              <CustomFlatRow
                key={ item.idCargaHoras }
                title={ item.cargaTitulo }
                description={ item.cargaDescripcion }
                hours={ item.cargaHoras }
                task={ item.tarea.tareaDescripcion || '' }
                onPressFn={ () => navigation.navigate('FrmCargaHorasScreen', { id: item.idCargaHoras.toString(), canShowDelete: false }) }
              />
            )}
            refreshControl={
              <RefreshControl refreshing={ isRefreshing } onRefresh={ onRefresh }/>
            }
          />
        )
      }
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
  },
});
