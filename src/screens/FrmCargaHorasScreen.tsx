import React, { useContext, useEffect, useState } from 'react';

import { Button, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';

import { Picker } from '@react-native-picker/picker';
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

interface Props extends StackScreenProps<SiaraStackParams, 'FrmCargaHorasScreen'>{}

export const FrmCargaHorasScreen = ( { route, navigation }: Props ) => {
  const { id = '' } = route.params;
  const { user } = useContext(AuthContext);
  const { addHorasSemanaActual, updateHorasSemanaActual } = useContext(HorasContext);
  const [ clientes, setClientes ] = useState<Cliente[]>([]);
  const [ proyectos, setProyectos ] = useState<Proyecto[]>([]);
  const [ tareas, setTareas ] = useState<ProyectoTarea[]>([]);
  const { monday } = useWeekRange(new Date());

  const [ date, setDate ] = useState(new Date());
  const [ dateOpen, setDateOpen ] = useState(false);

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
    loadCargaINdividual();
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

  const loadCargaINdividual = async () => {
    if ( idCargaHoras.length > 0 ) {
      const individual = await getCargaHorasIndividual(parseInt(idCargaHoras, 10));
      // setIsEditable(false);
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
      // TODO - Mostrar error al cargar horas con datos vacios
    }
  };

  const loadClientes = async () => {
    if ( user ) {
      const clientesData = await getClientes(user.matrizGenerales.empId);
      setClientes(clientesData);
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

  const save = async () => {
    if ( idCargaHoras.length > 0 && user ) {
      let aux = cargaFechaString.split('-');

      await updateHorasSemanaActual({
        idCargaHoras: parseInt(idCargaHoras, 10),
        cargaHoras: parseInt(cargaHoras, 10),
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
        cargaFechaString: `${aux[2]}/${aux[1]}/${aux[0]}`,
        editable: true,
      });
    } else {
      if ( user ) {
        await addHorasSemanaActual({
          cargaHoras: parseInt(cargaHoras, 10),
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

  return (
    <View style={ styles.container }>
      <ScrollView>
        <Text style={ styles.label }>Fecha:</Text>
        <TouchableOpacity
          style={ styles.dateButton }
          onPress={ () => setDateOpen(true) }
        >
          <Text style={ styles.dateButtonText }>
            {
              ( cargaFechaString.length === 0 )
                ? 'Seleccione una fecha'
                : `Fecha: ${cargaFechaString}`
            }
          </Text>
        </TouchableOpacity>
        {
          ( monday ) && (
            <>
              <DatePicker
                modal
                open={ dateOpen }
                date={ date }
                locale="es-MX"
                minimumDate={new Date(monday.toString())} maximumDate={new Date()} mode="date"
                onConfirm={(data) => {
                  setDateOpen(false);
                  setDate(data);
                  onChange(`${('00' + data.getDate()).slice(-2)}/${('00' +  data.getMonth() + 1).slice(-2)}/${data.getFullYear()}`, 'cargaFechaString');
                }}
                onCancel={() => {
                  setDateOpen(false);
                }}
              />
            </>
          )
        }

        <Text style={ styles.label }>Cliente:</Text>
        <Picker
          dropdownIconColor="#000"
          dropdownIconRippleColor="#777"
          style={ styles.picker }
          selectedValue={ idCliente }
          onValueChange={ (value) => {
            onChange(value, 'idCliente');
            setProyectos([]);
          }}
        >
          <Picker.Item label="- Selecione un cliente -" value="" />
          {
            clientes.map( (c) => (
              <Picker.Item
                label={ c.cteRazonSocial }
                value={ c.idCliente.toString() }
                key={ `${c.idCliente}-${c.cteClave}` }
              />
            ))
          }
        </Picker>

        <Text style={ styles.label }>Proyecto:</Text>
        <Picker
          dropdownIconColor="#000"
          dropdownIconRippleColor="#777"
          style={ styles.picker }
          selectedValue={ idProyecto }
          onValueChange={ (value) => onChange(value, 'idProyecto') }
        >
          <Picker.Item label="- Selecione un proyecto -" value="" />
          {
            proyectos.map( (p) => (
              <Picker.Item
                label={ p.proyDescripcion }
                value={ p.idProyecto.toString() }
                key={ `${p.idProyecto}-${p.proyClave}` }
              />
            ))
          }
        </Picker>

        <Text style={ styles.label }>Tarea:</Text>
        <Picker
          dropdownIconColor="#000"
          dropdownIconRippleColor="#777"
          style={ styles.picker }
          selectedValue={ idTarea }
          onValueChange={ (value) => onChange(value, 'idTarea') }
        >
          <Picker.Item label="- Selecione una tarea -" value="" />
          {
            tareas.map( (t) => (
              <Picker.Item
                label={ t.tareas.tareaDescripcion }
                value={ t.tareas.idTarea.toString() }
                key={ `${t.tareas.idTarea}-${t.tareas.tareaDescripcion}` }
              />
            ))
          }
        </Picker>

        <Text style={ styles.label }>Titulo:</Text>
        <TextInput
          style={ styles.textInput }
          placeholder="Titulo"
          value={ cargaTitulo }
          onChangeText={ (value) => onChange( value, 'cargaTitulo' ) }
        />

        <Text style={ styles.label }>Descripcion:</Text>
        <TextInput
          style={ styles.textArea }
          placeholder="Descripcion"
          value={ cargaDescripcion }
          onChangeText={ (value) => onChange( value, 'cargaDescripcion' ) }
          numberOfLines={ 5 }
          multiline={ true }
        />

        <Text style={ styles.label }>Notas:</Text>
        <TextInput
          style={ styles.textArea }
          placeholder="Notas"
          value={ cargaNotas }
          onChangeText={ (value) => onChange( value, 'cargaNotas' ) }
          numberOfLines={ 5 }
          multiline={ true }
        />

        <Text style={ styles.label }>Cantidad de horas:</Text>
        <TextInput
          style={ styles.textInput }
          placeholder="Horas"
          value={ cargaHoras }
          onChangeText={ (value) => onChange( value, 'cargaHoras' ) }
          keyboardType="numeric"
          maxLength={ 5 }
        />

        <Button
          title="Guardar"
          color={ colors.secondary }
          onPress={ save }
        />

        {/*<Text style={ styles.label }>{ JSON.stringify(form, null, 2) }</Text>*/}
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
  label: {
    fontSize: 18,
    color: 'black',
  },
  textInput: {
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginTop: 5,
    marginBottom: 15,
    borderRadius: 20,
    borderColor: 'rgba(0,0,0,0.4)',
    height: 40,
    color: '#000',
  },
  textArea: {
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginTop: 5,
    marginBottom: 15,
    borderRadius: 20,
    borderColor: 'rgba(0,0,0,0.4)',
    color: '#000',
  },
  picker: {
    marginTop: 5,
    marginBottom: 15,
    borderColor: 'rgba(0,0,0,0.4)',
    color: '#000',
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
    color: 'white',
    fontSize: 20,
  },
});
