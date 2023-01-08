import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  CargaHoras,
  Cliente,
  LoginResponse,
  Proyecto,
  ProyectoTarea,
  Usuario,
} from '../interfaces/appInterfaces';

const baseURL: string = 'http://siara.grupopm.mx:8087';
const siaraApi = axios.create({ baseURL });

siaraApi.interceptors.request.use(
  async(config) => {
    const token = await AsyncStorage.getItem('token');

    if ( token && config && config.headers ) {
      config.headers['x-token'] = token;
    }

    return config;
  }
);

export const getLogin = async ( username: string, password: string ) => {
  const { data } = await siaraApi.post<LoginResponse>('/api-rest-siara-ldap-jwt/auth/generatetoken', { username, password });
  return data;
};

export const getUserInfo = async ( username: string ) => {
  const { data } = await siaraApi.get<Usuario>(`/api-rest-siara/usuarios/${username}/username`);
  return data;
};

export const getCargaHorasIndividual = async ( idCargaHoras: number ) => {
  const { data } = await siaraApi.get<CargaHoras>('/api-rest-siara/cargaHoras/' + idCargaHoras);
  return data;
};

export const getCargaHorasSemana = async ( empId: number, monday: string, sunday: string ) => {
  const { data } = await siaraApi.get<CargaHoras[]>(`/api-rest-siara/cargaHoras/empleado/${empId}/${monday}/${sunday}`);
  return data;
};

export const getHistoricoHorasCargadas = async ( empId: number ) => {
  const { data } = await siaraApi.get<CargaHoras[]>('/api-rest-siara/cargaHoras/empleado/' + empId);
  return data;
};

export const getClientes = async ( empId: number ) => {
  const { data } = await siaraApi.get<Cliente[]>(`/api-rest-siara/clientes/${empId}/empleado`);
  return data;
};

export const getProyectosClientes = async ( idCliente: number, empId: number ) => {
  const { data } = await siaraApi.get<Proyecto[]>(`/api-rest-siara/proyectos/cliente/${idCliente}/empleado/${empId}`);
  return data;
};

export const getTareasByIdProyecto = async ( idProyecto: number ) => {
  const { data } = await siaraApi.get<ProyectoTarea[]>(`/api-rest-siara/proyectos/${idProyecto}/tareas`);
  return data;
};

export const postCargaHoras = async ( cargaHorasData: CargaHoras ) => {
    const { data } = await siaraApi.post<CargaHoras>('/api-rest-siara/cargaHoras', cargaHorasData);
    return data;
};
