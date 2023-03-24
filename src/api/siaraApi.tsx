import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  CargaHoras,
  Cliente,
  LoginResponse,
  Proyecto,
  ProyectoTarea, ServiceStatus,
  Usuario,
} from '../interfaces/appInterfaces';

const baseURL: string = 'http://siara.grupopm.mx:8087';
const siaraApi = axios.create({ baseURL });

siaraApi.interceptors.request.use(
  async( config: any ) => {
    const token = await AsyncStorage.getItem('token');

    if ( token && config && config.headers ) {
      config.headers.Authorization = `Bearer ${token}`;
      config.headers.setUserAgent('SiaraApp');
    }

    return config;
  }
);

export const getLogin = async ( username: string, password: string ) => {
  // const { data } = await siaraApi.post<LoginResponse>('/api-rest-siara-ldap-jwt/auth/generatetoken', { username, password });
  // return data;

  return { accessToken: '', tokenType: 'Bearer' };
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

export const postCargaHoras = async ( cargaHorasData: CargaHoras ) => {
  const { data } = await siaraApi.post<CargaHoras>('/api-rest-siara/cargaHoras', cargaHorasData);
  return data;
};

export const deleteCargaHoras = async ( idCargaHoras: number ) => {
  await siaraApi.delete('/api-rest-siara/cargaHoras/' + idCargaHoras);
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



export const getStatus = async ( context: string ): Promise<ServiceStatus> => {
  try {
    const { status } = await siaraApi.get(context);
    return { code: status, message: '' };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.log('error message: ', error.message);
      // 👇️ error: AxiosError<any, any>
      if (error.response) {
        // Request made but the server responded with an error
        // console.log(JSON.stringify(error.response, null, 2));
        return { code: error.response.status, message: error.message };
      } else if (error.request) {
        // Request made but no response is received from the server.
        // console.log(JSON.stringify(error.request, null, 2));
        return { code: error.request.status, message: error.request._response };
      } else {
        // Error occured while setting up the request
        console.log(JSON.stringify(error, null, 2));
        return { code: null, message: 'An unexpected error occurred.' };
      }
    } else {
      console.log('unexpected error: ', error);
      return { code: null, message: 'An unexpected error occurred' };
    }
  }
};
