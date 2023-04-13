import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  CargaHoras,
  Cliente,
  LoginResponse,
  Proyecto,
  ProyectoTarea,
  ServiceStatus,
  Usuario,
} from '../interfaces/appInterfaces';
import * as Sentry from '@sentry/react-native';

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

const fetchData = async (url: string, method: string, payload: any) => {
  try {
    const { data } = await siaraApi.request({
      data: payload,
      method,
      url,
    });

    return data;
  } catch (error) {
    if ( axios.isAxiosError(error) ) {
      if (error.response) {
        // Request made but the server responded with an error
        // console.log(JSON.stringify(error.response, null, 2));
        Sentry.captureMessage(error.message, { level: 'warning', extra: { method, url, payload } });
        return null;
      } else if (error.request) {
        // Request made but no response is received from the server.
        // console.log(JSON.stringify(error.request, null, 2));
        Sentry.captureMessage('Not response', { level: 'error' , extra: { url, method, payload }});
        throw new Error(error.request._response);
      } else {
        // Error occured while setting up the request
        // console.log(JSON.stringify(error, null, 2));
        Sentry.captureMessage('HTTP ERROR', { level: 'fatal' , extra: { url, method, payload }});
        throw new Error('An unexpected error occurred.');
      }
    } else {
      Sentry.captureException(error, { level: 'fatal'});
      throw new Error('An unexpected error occurred.');
    }
  }
};

export const getLogin = async ( username: string, password: string ) : Promise<LoginResponse> => {
  return await fetchData('/api-rest-siara-ldap-jwt/auth/generatetoken', 'POST', { username, password });

  // return { accessToken: '', tokenType: 'Bearer' };
};

export const getUserInfo = async ( username: string ) : Promise<Usuario> => {
  return fetchData(`/api-rest-siara/usuarios/${username}/username`, 'GET', null);
};



export const getCargaHorasIndividual = async ( idCargaHoras: number ) : Promise<CargaHoras> => {
  return fetchData('/api-rest-siara/cargaHoras/' + idCargaHoras, 'GET', null);
};

export const getCargaHorasSemana = async ( empId: number, monday: string, sunday: string ) : Promise<CargaHoras[]> => {
  return fetchData(`/api-rest-siara/cargaHoras/empleado/${empId}/${monday}/${sunday}`, 'GET', null);
};

export const getHistoricoHorasCargadas = async ( empId: number ) : Promise<CargaHoras[]> => {
  return fetchData('/api-rest-siara/cargaHoras/empleado/' + empId, 'GET', null);
};

export const postCargaHoras = async ( cargaHorasData: CargaHoras ) : Promise<CargaHoras> => {
  return fetchData('/api-rest-siara/cargaHoras', 'POST', cargaHorasData);
};

export const deleteCargaHoras = async ( idCargaHoras: number ) : Promise<void> => {
  await fetchData('/api-rest-siara/cargaHoras/' + idCargaHoras, 'DELETE', null);
};



export const getClientes = async ( empId: number ) : Promise<Cliente[]> => {
  return fetchData(`/api-rest-siara/clientes/${empId}/empleado`, 'GET', null);
};

export const getProyectosClientes = async ( idCliente: number, empId: number ) : Promise<Proyecto[]> => {
  return fetchData(`/api-rest-siara/proyectos/cliente/${idCliente}/empleado/${empId}`, 'GET', null);
};

export const getTareasByIdProyecto = async ( idProyecto: number ) : Promise<ProyectoTarea[]> => {
  return fetchData(`/api-rest-siara/proyectos/${idProyecto}/tareas`, 'GET', null);
};



export const getStatus = async ( context: string ): Promise<ServiceStatus> => {
  try {
    const { status } = await siaraApi.get(context);
    return { code: status, message: '' };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        return { code: error.response.status, message: error.message };
      } else if (error.request) {
        return { code: error.request.status, message: error.request._response };
      } else {
        return { code: null, message: 'An unexpected error occurred.' };
      }
    } else {
      Sentry.captureException(error);
      return { code: null, message: 'An unexpected error occurred' };
    }
  }
};
