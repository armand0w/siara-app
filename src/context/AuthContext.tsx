import AsyncStorage from '@react-native-async-storage/async-storage';

import React, { createContext, useEffect, useReducer } from 'react';
import { LoginData, Usuario } from '../interfaces/appInterfaces';
import { authReducer, AuthState } from './authReducer';

import { getLogin, getUserInfo } from '../api/siaraApi';

type AuthContextProps = {
  errorMessage: string;
  token: string | null;
  user: Usuario | null;
  status: 'checking' | 'authenticated' | 'not-authenticated';
  signIn: ( loginData: LoginData ) => void;
  logOut: () => void;
  removeError: () => void;
};

const authInicialState: AuthState = {
  status: 'checking',
  token: null,
  user: null,
  errorMessage: '',
};

export const AuthContext = createContext({} as AuthContextProps);

export const AuthProvider = ({ children }: any) => {
  const [ state, dispatch ] = useReducer( authReducer, authInicialState );

  useEffect(() => {
    checkToken();
  }, []);

  const checkToken = async () => {
    const token = await AsyncStorage.getItem('token');
    const userInfo = await AsyncStorage.getItem('userInfo');

    if ( !token ) {
      return dispatch({ type: 'notAuthenticated' });
    }

    if ( userInfo ) {
      dispatch({
        type: 'login',
        payload: {
          token: token,
          user: JSON.parse(userInfo),
        },
      });
    }
  };
  const signIn = async ( { username, password }: LoginData ) => {
    try {
      const loginData = await getLogin( username, password );
      const userInfo = await getUserInfo( username );

      dispatch({
        type: 'login',
        payload: {
          token: loginData.accessToken,
          user: userInfo,
        },
      });

      await AsyncStorage.setItem('userName', username);
      await AsyncStorage.setItem('token', loginData.accessToken);
      await AsyncStorage.setItem('userInfo', JSON.stringify(userInfo, null, 0));
    } catch (error: any) {
      console.log(error);
      dispatch({
        type: 'addError',
        payload: error.response.data.msg || 'Informacion Erronea',
      });
    }
  };
  const logOut = async () => {
    // await AsyncStorage.removeItem('userName');
    await AsyncStorage.removeItem('token');
    await AsyncStorage.removeItem('userInfo');
    dispatch({
      type: 'logout',
    });
  };
  const removeError = () => {
    dispatch({ type: 'removeError' });
  };

  return (
    <AuthContext.Provider value={{
      ...state,
      signIn,
      // signUp,
      logOut,
      removeError,
    }}>
      { children }
    </AuthContext.Provider>
  );
};
