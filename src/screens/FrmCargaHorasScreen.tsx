import React, { useContext, useEffect, useState } from 'react';

import { Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, useColorScheme, View } from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';

import { Picker } from '@react-native-picker/picker';
import Icon from 'react-native-vector-icons/Ionicons';
import DatePicker from 'react-native-date-picker';

import { Cliente, Proyecto, ProyectoTarea } from '../interfaces/appInterfaces';
import { SiaraStackParams } from '../navigator/SiaraNavigator';
import { AuthContext } from '../context/AuthContext';
import { useForm } from '../hooks/useForm';
import { colors } from '../theme/colors';
import { HorasContext } from '../context/HorasContext';
import { useWeekRange } from '../hooks/useWeekRange';
import {
  getCargaHorasIndividual,
  getClientes,
  getProyectosClientes,
  getTareasByIdProyecto,
} from '../api/siaraApi';
import { Colors } from 'react-native/Libraries/NewAppScreen';

interface Props extends StackScreenProps<SiaraStackParams, 'FrmCargaHorasScreen'>{}

export const FrmCargaHorasScreen = ( { route, navigation }: Props ) => {
  const { id = '', canShowDelete } = route.params;
  const { user } = useContext(AuthContext);
  const { addHorasSemanaActual, updateHorasSemanaActual, deleteHoras } = useContext(HorasContext);
  const [ clientes, setClientes ] = useState<Cliente[]>([]);
  const [ proyectos, setProyectos ] = useState<Proyecto[]>([]);
  const [ tareas, setTareas ] = useState<ProyectoTarea[]>([]);
  const { monday, sunday } = useWeekRange(new Date());

  const isDarkMode = useColorScheme() === 'dark';
  const labelTheme = isDarkMode ? {fontSize: 18, color: Colors.white} : {fontSize: 18, color: Colors.black};
  const customTheme = isDarkMode ?
    { borderColor: Colors.dark, color: Colors.light } :
    { borderColor: 'rgba(0,0,0,0.4)', color: Colors.black };

  const [ date, setDate ] = useState(new Date());
  const [ dateOpen, setDateOpen ] = useState(false);

  const [ isEditable, setEditable ] = useState(false);

  const { idCargaHoras, cargaFechaString, cargaHoras, cargaTitulo, cargaDescripcion, cargaNotas, idProyecto, idTarea, idCliente, onChange, setFormValues, form } = useForm({
    idCargaHoras: id,
    cargaFechaString: '',
    cargaHoras: '',
    cargaTitulo: '',
    cargaDescripcion: '',
    cargaNotas: '',
    idProyecto: '',
    idTarea: '',
    idCliente: '',
  });

  useEffect(() => {
    if ( isEditable && id.length > 0 && canShowDelete ) {
      navigation.setOptions({
        headerRight: () => (
          <TouchableOpacity
            // activeOpacity={ 0.7 }
            style={{ marginRight: 10 }}
            onPress={ showDeleteDlg }
          >
            <Text style={ styles.borrarBtn }>Borrar</Text>
          </TouchableOpacity>
        ),
      });
    }
  }, [ isEditable ]);

  useEffect(() => {
    loadCargaIndividual();
  }, []);

  useEffect(() => {
    loadClientes();
  }, []);

  useEffect(() => {
    loadProyectos();
  }, [idCliente]);

  useEffect(() => {
    loadTareas();
  }, [idProyecto]);

  useEffect(() => {
    if ( id.length === 0 ) {
      setEditable( true );
    } else {
      if ( monday && sunday && form.cargaFechaString ) {
        let cargaDate = Date.parse(form.cargaFechaString);
        if ( form.cargaFechaString.includes('/') ) {
          cargaDate = Date.parse(form.cargaFechaString.split('/').reverse().join('-'));
        }
        setEditable( cargaDate >= Date.parse(monday) && cargaDate <= Date.parse(sunday) && canShowDelete );
      }
    }
  }, [ form, monday, sunday ]);

  const loadCargaIndividual = async () => {
    if ( idCargaHoras.length > 0 ) {
      const individual = await getCargaHorasIndividual(parseInt(idCargaHoras, 10));
      if ( individual.proyecto.clientes ) {
        setFormValues({
          idCargaHoras: (individual.idCargaHoras) ? individual.idCargaHoras.toString() : '',
          cargaFechaString: (individual.cargaFecha) ? individual.cargaFecha : '',
          cargaHoras: individual.cargaHoras.toString(),
          cargaTitulo: individual.cargaTitulo,
          cargaDescripcion: individual.cargaDescripcion,
          cargaNotas: individual.cargaNotas,
          idProyecto: individual.proyecto.idProyecto.toString(),
          idTarea: individual.tarea.idTarea.toString(),
          idCliente: individual.proyecto.clientes.idCliente.toString(),
        });
      }
    }
  };

  const loadClientes = async () => {
    if ( user ) {
      const clientesData = await getClientes(user.matrizGenerales.empId);
      setClientes( clientesData );
    }
  };

  const loadProyectos = async () => {
    if ( user && idCliente ) {
      const proyectosData = await getProyectosClientes(parseInt(idCliente, 10), user.matrizGenerales.empId);
      setProyectos( proyectosData );
    }
  };

  const loadTareas = async () => {
    if ( idProyecto ) {
      const tareasData = await getTareasByIdProyecto(parseInt(idProyecto, 10));
      setTareas( tareasData );
    }
  };

  const validaGuardado = (  ) => {
    if ( cargaHoras.length === 0 ) {
      Alert.alert('Falta campo', 'La cantidad de horas no puede ser vacia');
      return;
    } else {
      try {
        let h = parseFloat(cargaHoras);
        if ( isNaN(h) ) {
          Alert.alert('Cantidad de horas invalido', 'El numero de horas es invalido');
          return;
        }

        if ( h <= 0 ) {
          Alert.alert('Cantidad de horas invalido', 'El numero de horas no puede ser negativo');
          return;
        }
      } catch (e) {
        console.log(e);
        Alert.alert('Cantidad de horas erronea', 'El numero de horas no es valido');
        return;
      }
    }

    if ( cargaFechaString.length === 0 ) {
      Alert.alert('Falta campo', 'El campo fecha es obligatorio');
      return;
    }

    if ( idCliente.length === 0 ) {
      Alert.alert('Falta campo', 'El campo cliente es obligatorio');
      return;
    }

    if ( idProyecto.length === 0 ) {
      Alert.alert('Falta campo', 'El campo proyecto es obligatorio');
      return;
    }

    if ( idTarea.length === 0 ) {
      Alert.alert('Falta campo', 'El campo tarea es obligatorio');
      return;
    }

    if ( cargaTitulo.length === 0 ) {
      Alert.alert('Falta campo', 'El campo titulo es obligatorio');
      return;
    }

    if ( cargaDescripcion.length === 0 ) {
      Alert.alert('Falta campo', 'El campo descripcion es obligatorio');
      return;
    }

    return true;
  };

  const save = async () => {
    if ( !validaGuardado() ) {
      return;
    }

    if ( idCargaHoras.length > 0 && user ) { // edicion
      let aux;
      if ( cargaFechaString.includes('-') ) {
        aux = cargaFechaString.split('-').reverse().join('/');
      } else {
        aux = cargaFechaString;
      }

      await updateHorasSemanaActual({
        idCargaHoras: parseInt(idCargaHoras, 10),
        cargaHoras: parseFloat(cargaHoras),
        cargaTitulo,
        cargaDescripcion,
        cargaNotas,
        matrizGenerales: user?.matrizGenerales,
        idProyecto: parseInt(idProyecto, 10),
        proyecto: {
          idProyecto: parseInt(idProyecto, 10),
        },
        tarea: {
          idTarea: parseInt(idTarea, 10),
        },
        cargaFecha: cargaFechaString,
        cargaFechaString: aux,
        editable: true,
      });
    } else { // nuevo registro
      if ( user ) {
        await addHorasSemanaActual({
          cargaHoras: parseFloat(cargaHoras),
          cargaTitulo,
          cargaDescripcion,
          cargaNotas,
          matrizGenerales: user?.matrizGenerales,
          idProyecto: parseInt(idProyecto, 10),
          proyecto: {
            idProyecto: parseInt(idProyecto, 10),
          },
          tarea: {
            idTarea: parseInt(idTarea, 10),
          },
          cargaFechaString,
        });
      }
    }

    navigation.pop();
  };

  const showDeleteDlg = async () => {
    Alert.alert('Borrar horas registradas', `Seguro que desea borrar: ${form.cargaTitulo} (${form.cargaHoras})`, [
      {
        text: 'Cancelar',
      },
      {
        text: 'Ok',
        onPress: () => {
          deleteHoras( parseInt(id, 10) );
          navigation.pop();
        },
      },
    ]);
  };

  const formatDate = (selected: Date) => {
    function padTo2Digits(num: number) {
      return num.toString().padStart(2, '0');
    }

    return [
      padTo2Digits(selected.getDate()),
      padTo2Digits(selected.getMonth() + 1),
      selected.getFullYear(),
    ].join('/');
  };

  return (
    <View style={{
      ...styles.container,
      backgroundColor: isDarkMode ? Colors.black : Colors.white,
    }}>
      <ScrollView>
        <Text style={ labelTheme }>Fecha*:</Text>
        {
          ( isEditable && id === '' ) ?
            <TouchableOpacity
                style={ styles.dateButton }
                onPress={ () => setDateOpen(true) }
            >
                <Text style={ styles.dateButtonText }>
                    <Icon name="calendar-outline" size={ 25 }/>
                    &nbsp;&nbsp;
                  {
                    ( cargaFechaString.length === 0 )
                      ? 'Seleccione una fecha'
                      : `Fecha: ${cargaFechaString}`
                  }
                </Text>
            </TouchableOpacity> :
            <TextInput
              style={{ ...styles.textInput, ...customTheme }}
              placeholder="Fecha de carga"
              value={ cargaFechaString.replace(/-/g, '/') }
              editable={ isEditable }
            />
        }
        {
          ( monday && sunday ) && (
            <>
              <DatePicker
                modal
                open={ dateOpen }
                date={ date }
                locale="es-MX"
                // minimumDate={ new Date(monday.toString()) }
                // maximumDate={ new Date(sunday.toString()) }
                mode="date"
                onConfirm={(data) => {
                  setDateOpen( false );
                  setDate( data );
                  onChange(formatDate(data), 'cargaFechaString');
                }}
                onCancel={() => {
                  setDateOpen(false);
                }}
              />
            </>
          )
        }

        <Text style={ labelTheme }>Cliente*:</Text>
        <Picker
          dropdownIconColor={ isDarkMode ? Colors.white : Colors.black }
          dropdownIconRippleColor={ isDarkMode ? Colors.white : colors.secondary }
          style={{ ...styles.picker, ...customTheme }}
          selectedValue={ idCliente }
          enabled={ isEditable }
          onValueChange={ (value) => {
            onChange(value, 'idCliente');
            setProyectos([]);
          }}
        >
          <Picker.Item
            color={ isDarkMode ? Colors.white : Colors.black }
            label="- Selecione un cliente -" value=""
          />
          {
            clientes.map( (c) => (
              <Picker.Item
                color={ isDarkMode ? Colors.white : Colors.black }
                label={ c.cteRazonSocial }
                value={ c.idCliente.toString() }
                key={ `${c.idCliente}-${c.cteClave}` }
              />
            ))
          }
        </Picker>

        <Text style={ labelTheme }>Proyecto*:</Text>
        <Picker
          dropdownIconColor={ isDarkMode ? Colors.white : Colors.black }
          dropdownIconRippleColor={ isDarkMode ? Colors.white : colors.secondary }
          style={{ ...styles.picker, ...customTheme }}
          selectedValue={ idProyecto }
          onValueChange={ (value) => onChange(value, 'idProyecto') }
          enabled={ isEditable }
        >
          <Picker.Item
            color={ isDarkMode ? Colors.white : Colors.black }
            label="- Selecione un proyecto -" value=""
          />
          {
            proyectos.map( (p) => (
              <Picker.Item
                color={ isDarkMode ? Colors.white : Colors.black }
                label={ p.proyDescripcion }
                value={ p.idProyecto.toString() }
                key={ `${p.idProyecto}-${p.proyClave}` }
              />
            ))
          }
        </Picker>

        <Text style={ labelTheme }>Tarea*:</Text>
        <Picker
          dropdownIconColor={ isDarkMode ? Colors.white : Colors.black }
          dropdownIconRippleColor={ isDarkMode ? Colors.white : colors.secondary }
          style={{ ...styles.picker, ...customTheme }}
          selectedValue={ idTarea }
          onValueChange={ (value) => onChange(value, 'idTarea') }
          enabled={ isEditable }
        >
          <Picker.Item
            color={ isDarkMode ? Colors.white : Colors.black }
            label="- Selecione una tarea -" value=""
          />
          {
            tareas.map( (t) => (
              <Picker.Item
                color={ isDarkMode ? Colors.white : Colors.black }
                label={ t.tareas.tareaDescripcion }
                value={ t.tareas.idTarea.toString() }
                key={ `${t.tareas.idTarea}-${t.tareas.tareaDescripcion}` }
              />
            ))
          }
        </Picker>

        <Text style={ labelTheme }>Titulo*:</Text>
        <TextInput
          style={{ ...styles.picker, ...customTheme }}
          placeholder="Titulo"
          value={ cargaTitulo }
          onChangeText={ (value) => onChange( value, 'cargaTitulo' ) }
          editable={ isEditable }
        />

        <Text style={ labelTheme }>Descripcion*:</Text>
        <TextInput
          style={{ ...styles.textArea, ...customTheme }}
          placeholder="Descripcion"
          value={ cargaDescripcion }
          onChangeText={ (value) => onChange( value, 'cargaDescripcion' ) }
          numberOfLines={ 5 }
          multiline={ true }
          editable={ isEditable }
        />

        <Text style={ labelTheme }>Notas:</Text>
        <TextInput
          style={{ ...styles.textArea, ...customTheme }}
          placeholder="Notas"
          value={ cargaNotas }
          onChangeText={ (value) => onChange( value, 'cargaNotas' ) }
          numberOfLines={ 5 }
          multiline={ true }
          editable={ isEditable }
        />

        <Text style={ labelTheme }>Cantidad de horas*:</Text>
        <TextInput
          style={{ ...styles.textInput, ...customTheme }}
          placeholder="Horas"
          value={ cargaHoras }
          onChangeText={ (value) => onChange( value, 'cargaHoras' ) }
          keyboardType="numeric"
          maxLength={ 5 }
          editable={ isEditable }
        />

        {
          ( isEditable ) &&
            <TouchableOpacity
              style={ styles.dateButton }
              onPress={ save }
            >
              <Text style={ styles.dateButtonText }>
                <Icon name="save" size={ 25 }/>
                &nbsp;&nbsp;Guardar
              </Text>
            </TouchableOpacity>
        }
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 10,
    marginHorizontal: 20,
  },
  textInput: {
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginTop: 5,
    marginBottom: 15,
    borderRadius: 20,
    height: 40,
  },
  textArea: {
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginTop: 5,
    marginBottom: 15,
    borderRadius: 20,
  },
  picker: {
    marginTop: 5,
    marginBottom: 15,
  },
  dateButton: {
    flex: 1,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginTop: 5,
    marginBottom: 15,
    borderRadius: 20,
    backgroundColor: colors.secondary,
    alignItems: 'center',
  },
  dateButtonText: {
    color: colors.white,
    fontSize: 20,
  },
  borrarBtn: {
    fontSize: 13,
    color: colors.primary,
  },
});
